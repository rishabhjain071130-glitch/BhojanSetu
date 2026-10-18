import { Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { RecoveryRequest, IRecoveryRequest } from '../models/RecoveryRequest.js';
import { FoodListing } from '../models/FoodListing.js';
import { AuthRequest } from '../middleware/auth.js';

export async function createRequest(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const listingId = req.params.id as string;
    const { requestedQuantity, collectionNote } = req.body;

    if (!Types.ObjectId.isValid(listingId)) {
      res.status(400).json({ success: false, error: 'Invalid listing identifier format.' });
      return;
    }

    const partner = req.user!;
    if (partner.verificationStatus !== 'verified') {
      res.status(403).json({
        success: false,
        error: 'Only verified recovery partners can request surplus food.',
      });
      return;
    }

    const listing = await FoodListing.findById(listingId);
    if (!listing) {
      res.status(404).json({ success: false, error: 'Food listing not found.' });
      return;
    }

    // Gate: collection deadline
    if (new Date(listing.collectionDeadline).getTime() <= Date.now()) {
      listing.status = 'expired';
      await listing.save();
      res.status(409).json({
        success: false,
        error: 'Cannot request listing: Collection deadline has already expired.',
      });
      return;
    }

    // Gate: listing status
    if (listing.status !== 'open' && listing.status !== 'requested') {
      res.status(409).json({
        success: false,
        error: `Cannot request listing: Listing is currently '${listing.status}'.`,
      });
      return;
    }

    // Gate: available quantity
    const remainingQuantity = listing.quantity - (listing.allocatedQuantity || 0);
    if (requestedQuantity > remainingQuantity) {
      res.status(409).json({
        success: false,
        error: `Requested quantity (${requestedQuantity} ${listing.unit}) exceeds available surplus (${remainingQuantity} ${listing.unit}).`,
      });
      return;
    }

    // Gate: partner capacity
    if (partner.partnerCapacity && requestedQuantity > partner.partnerCapacity) {
      res.status(409).json({
        success: false,
        error: `Requested quantity (${requestedQuantity} ${listing.unit}) exceeds registered partner capacity (${partner.partnerCapacity} ${listing.unit}).`,
      });
      return;
    }

    // Gate: duplicate active request check
    const existingRequest = await RecoveryRequest.findOne({
      listingId: listing._id,
      partnerId: partner._id,
      status: { $in: ['pending', 'approved', 'collected'] },
    });

    if (existingRequest) {
      res.status(409).json({
        success: false,
        error: `You already have an active request in '${existingRequest.status}' status for this food listing.`,
      });
      return;
    }

    // Create the recovery request
    const request = await RecoveryRequest.create({
      listingId: listing._id,
      partnerId: partner._id,
      requestedQuantity,
      collectionNote,
      status: 'pending',
      statusHistory: [
        {
          actor: partner._id,
          actorRole: partner.role,
          actorName: partner.name,
          previousStatus: 'none',
          newStatus: 'pending',
          timestamp: new Date(),
          reason: 'Initial rescue request submitted by partner',
        },
      ],
    });

    // Update listing to requested if currently open
    if (listing.status === 'open') {
      listing.status = 'requested';
      await listing.save();
    }

    res.status(201).json({
      success: true,
      message: 'Rescue request submitted successfully. Awaiting organizer/coordinator approval.',
      request,
    });
  } catch (error) {
    next(error);
  }
}

export async function getListingRequests(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const listingId = req.params.id as string;

    if (!Types.ObjectId.isValid(listingId)) {
      res.status(400).json({ success: false, error: 'Invalid listing identifier format.' });
      return;
    }

    const listing = await FoodListing.findById(listingId);
    if (!listing) {
      res.status(404).json({ success: false, error: 'Food listing not found.' });
      return;
    }

    const isOwner = req.user && listing.ownerId.toString() === req.user._id.toString();
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      res.status(403).json({
        success: false,
        error: 'Forbidden: Only the listing organizer or admin can view incoming requests.',
      });
      return;
    }

    const requests = await RecoveryRequest.find({ listingId: listing._id })
      .populate('partnerId', 'name email phone organizationName partnerCapacity partnerServiceArea verificationStatus')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyRequests(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    const requests = await RecoveryRequest.find({ partnerId: req.user._id })
      .populate({
        path: 'listingId',
        populate: { path: 'ownerId', select: 'name organizationName email phone' },
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests,
    });
  } catch (error) {
    next(error);
  }
}

export async function makeRequestDecision(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const { status, reason } = req.body; // 'approved' | 'rejected'

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, error: 'Invalid request identifier format.' });
      return;
    }

    const request = await RecoveryRequest.findById(id);
    if (!request) {
      res.status(404).json({ success: false, error: 'Rescue request not found.' });
      return;
    }

    if (request.status !== 'pending') {
      res.status(409).json({
        success: false,
        error: `Cannot change decision: Request has already been ${request.status}.`,
      });
      return;
    }

    const listing = await FoodListing.findById(request.listingId);
    if (!listing) {
      res.status(404).json({ success: false, error: 'Associated food listing not found.' });
      return;
    }

    const isOwner = req.user && listing.ownerId.toString() === req.user._id.toString();
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      res.status(403).json({
        success: false,
        error: 'Forbidden: You do not have authorization to approve/reject requests for this listing.',
      });
      return;
    }

    if (status === 'approved') {
      // Re-check available quantity
      const remainingQuantity = listing.quantity - (listing.allocatedQuantity || 0);
      if (request.requestedQuantity > remainingQuantity) {
        res.status(409).json({
          success: false,
          error: `Capacity conflict: remaining surplus (${remainingQuantity} ${listing.unit}) is less than requested (${request.requestedQuantity} ${listing.unit}).`,
        });
        return;
      }

      // Check deadline
      if (new Date(listing.collectionDeadline).getTime() <= Date.now()) {
        listing.status = 'expired';
        await listing.save();
        res.status(409).json({
          success: false,
          error: 'Cannot approve request: Listing collection deadline has expired.',
        });
        return;
      }

      // Approve request
      const prevStatus = request.status;
      request.status = 'approved';
      request.approvedBy = req.user!._id;
      request.approvedAt = new Date();
      request.statusHistory.push({
        actor: req.user!._id,
        actorRole: req.user!.role,
        actorName: req.user!.name,
        previousStatus: prevStatus,
        newStatus: 'approved',
        timestamp: new Date(),
        reason: reason || 'Approved by coordinator/organizer',
      });
      await request.save();

      // Update listing
      listing.status = 'assigned';
      listing.allocatedQuantity = (listing.allocatedQuantity || 0) + request.requestedQuantity;
      listing.assignedPartnerId = request.partnerId;
      listing.assignedRequestId = request._id;
      await listing.save();

      // Automatically reject any competing pending requests that exceed remaining quantity
      const remainingAfterApproval = listing.quantity - listing.allocatedQuantity;
      if (remainingAfterApproval <= 0) {
        const otherPendingRequests = await RecoveryRequest.find({
          listingId: listing._id,
          _id: { $ne: request._id },
          status: 'pending',
        });

        for (const otherReq of otherPendingRequests) {
          otherReq.status = 'rejected';
          otherReq.statusHistory.push({
            actor: req.user!._id,
            actorRole: req.user!.role,
            actorName: req.user!.name,
            previousStatus: 'pending',
            newStatus: 'rejected',
            timestamp: new Date(),
            reason: 'Listing fully allocated to another partner',
          });
          await otherReq.save();
        }
      }

      res.json({
        success: true,
        message: 'Request approved successfully. The partner is now assigned.',
        request,
      });
      return;
    } else if (status === 'rejected') {
      const prevStatus = request.status;
      request.status = 'rejected';
      request.statusHistory.push({
        actor: req.user!._id,
        actorRole: req.user!.role,
        actorName: req.user!.name,
        previousStatus: prevStatus,
        newStatus: 'rejected',
        timestamp: new Date(),
        reason: reason || 'Request declined by organizer/coordinator',
      });
      await request.save();

      // Check if any pending requests remain on listing
      const remainingPending = await RecoveryRequest.countDocuments({
        listingId: listing._id,
        status: 'pending',
      });

      if (remainingPending === 0 && listing.status === 'requested') {
        listing.status = 'open';
        await listing.save();
      }

      res.json({
        success: true,
        message: 'Request rejected.',
        request,
      });
      return;
    }
  } catch (error) {
    next(error);
  }
}

export async function updateRequestStatus(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const { status, reason } = req.body; // 'collected' | 'delivered'

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, error: 'Invalid request identifier format.' });
      return;
    }

    const request = await RecoveryRequest.findById(id);
    if (!request) {
      res.status(404).json({ success: false, error: 'Rescue request not found.' });
      return;
    }

    const listing = await FoodListing.findById(request.listingId);
    if (!listing) {
      res.status(404).json({ success: false, error: 'Associated food listing not found.' });
      return;
    }

    // Role check: Only assigned partner or admin can record collection/delivery
    const isAssignedPartner =
      req.user &&
      request.partnerId.toString() === req.user._id.toString() &&
      req.user.role === 'partner';
    const isAdmin = req.user && req.user.role === 'admin';

    if (!isAssignedPartner && !isAdmin) {
      res.status(403).json({
        success: false,
        error: 'Forbidden: Only the assigned recovery partner or an admin can record collection and delivery.',
      });
      return;
    }

    // Validate state transitions
    if (status === 'collected') {
      if (request.status !== 'approved') {
        res.status(409).json({
          success: false,
          error: `Invalid transition: Request must be in 'approved' status before recording collection. Current status: '${request.status}'.`,
        });
        return;
      }

      const prevStatus = request.status;
      request.status = 'collected';
      request.collectedAt = new Date();
      request.statusHistory.push({
        actor: req.user!._id,
        actorRole: req.user!.role,
        actorName: req.user!.name,
        previousStatus: prevStatus,
        newStatus: 'collected',
        timestamp: new Date(),
        reason: reason || 'Food collected from event location by verified partner',
      });
      await request.save();

      listing.status = 'collected';
      await listing.save();

      res.json({
        success: true,
        message: 'Food collection recorded successfully.',
        request,
      });
      return;
    } else if (status === 'delivered') {
      if (request.status !== 'collected') {
        res.status(409).json({
          success: false,
          error: `Invalid transition: Food must be recorded as 'collected' before marking as delivered. Current status: '${request.status}'.`,
        });
        return;
      }

      const prevStatus = request.status;
      request.status = 'delivered';
      request.deliveredAt = new Date();
      request.statusHistory.push({
        actor: req.user!._id,
        actorRole: req.user!.role,
        actorName: req.user!.name,
        previousStatus: prevStatus,
        newStatus: 'delivered',
        timestamp: new Date(),
        reason: reason || 'Food successfully distributed to community kitchen / beneficiaries',
      });
      await request.save();

      listing.status = 'delivered';
      await listing.save();

      res.json({
        success: true,
        message: 'Food delivery and rescue completion recorded successfully!',
        request,
      });
      return;
    } else {
      res.status(400).json({
        success: false,
        error: `Unsupported status transition: '${status}'. Allowed: 'collected', 'delivered'.`,
      });
      return;
    }
  } catch (error) {
    next(error);
  }
}
