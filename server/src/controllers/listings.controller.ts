import { Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { FoodListing, IFoodListing } from '../models/FoodListing.js';
import { User } from '../models/User.js';
import { AuthRequest } from '../middleware/auth.js';
import { rankPartnersForListing } from '../services/matching.service.js';

/**
 * Helper to dynamically check and tag expired listings
 */
function checkAndApplyExpiration(listing: IFoodListing): IFoodListing {
  const now = new Date();
  if (
    (listing.status === 'open' || listing.status === 'requested') &&
    new Date(listing.collectionDeadline).getTime() < now.getTime()
  ) {
    listing.status = 'expired';
  }
  return listing;
}

/**
 * Helper to strip private pickup instructions from unauthorized eyes
 */
function sanitizeListingForUser(listing: any, user?: any) {
  const listingObj = listing.toObject ? listing.toObject() : { ...listing };
  const userId = user ? (user._id ? user._id.toString() : user.id?.toString()) : null;

  const ownerId = listingObj.ownerId?._id
    ? listingObj.ownerId._id.toString()
    : listingObj.ownerId?.toString();
  const isOwner = Boolean(userId && ownerId && ownerId === userId);
  const isAdmin = Boolean(user && user.role === 'admin');

  const assignedPartnerId = listingObj.assignedPartnerId?._id
    ? listingObj.assignedPartnerId._id.toString()
    : listingObj.assignedPartnerId?.toString();

  const isAssignedPartner = Boolean(
    userId &&
    assignedPartnerId &&
    assignedPartnerId === userId &&
    ['assigned', 'collected', 'delivered'].includes(listingObj.status)
  );

  if (!isOwner && !isAdmin && !isAssignedPartner) {
    listingObj.pickupInstructions =
      '🔒 Detailed pickup instructions will unlock upon verified partner assignment approval.';
  }

  // Calculate live urgency indicator
  const now = Date.now();
  const deadline = new Date(listingObj.collectionDeadline).getTime();
  const hoursLeft = Math.max(0, (deadline - now) / (1000 * 60 * 60));
  listingObj.hoursRemaining = Number(hoursLeft.toFixed(1));
  listingObj.isExpired = deadline < now;

  return listingObj;
}

export async function createListing(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    const {
      eventName,
      eventType,
      foodTitle,
      foodCategory,
      description,
      quantity,
      unit,
      preparedAt,
      storageConditions,
      allergenNotes,
      collectionDeadline,
      areaOrAddress,
      pickupInstructions,
    } = req.body;

    const listing = await FoodListing.create({
      ownerId: req.user._id,
      eventName,
      eventType,
      foodTitle,
      foodCategory,
      description,
      quantity,
      unit,
      preparedAt: new Date(preparedAt),
      storageConditions,
      allergenNotes: allergenNotes || '',
      collectionDeadline: new Date(collectionDeadline),
      areaOrAddress,
      pickupInstructions,
      status: 'open',
      allocatedQuantity: 0,
    });

    res.status(201).json({
      success: true,
      message: 'Surplus food listing created successfully.',
      listing: sanitizeListingForUser(listing, req.user),
    });
  } catch (error) {
    next(error);
  }
}

export async function getListings(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      category,
      eventType,
      area,
      status,
      urgentOnly,
      ownerOnly,
      page = '1',
      limit = '20',
    } = req.query;

    const query: any = {};

    // Filter by owner if requested
    if (ownerOnly === 'true' && req.user) {
      query.ownerId = req.user._id;
    }

    // Filter by status:
    // If not specified and not owner, default to open & requested for recovery partners
    if (status && typeof status === 'string' && status !== 'all') {
      query.status = status;
    } else if (!ownerOnly && req.user?.role === 'partner') {
      query.status = { $in: ['open', 'requested'] };
    }

    // Category filter
    if (category && typeof category === 'string' && category !== 'all') {
      query.foodCategory = category;
    }

    // Event type filter
    if (eventType && typeof eventType === 'string' && eventType !== 'all') {
      query.eventType = eventType;
    }

    // Area filter (case-insensitive substring)
    if (area && typeof area === 'string' && area.trim().length > 0) {
      query.areaOrAddress = { $regex: area.trim(), $options: 'i' };
    }

    // Urgent filter (deadline within next 4 hours and in the future)
    const now = new Date();
    if (urgentOnly === 'true') {
      const fourHoursLater = new Date(now.getTime() + 4 * 60 * 60 * 1000);
      query.collectionDeadline = { $gte: now, $lte: fourHoursLater };
    }

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [total, listings] = await Promise.all([
      FoodListing.countDocuments(query),
      FoodListing.find(query)
        .populate('ownerId', 'name organizationName email')
        .populate('assignedPartnerId', 'name organizationName phone')
        .sort({ collectionDeadline: 1 })
        .skip(skip)
        .limit(limitNum),
    ]);

    // Lazily evaluate deadline expiration on the fly
    const processedListings = listings.map((l) => {
      const updated = checkAndApplyExpiration(l);
      return sanitizeListingForUser(updated, req.user);
    });

    res.json({
      success: true,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
      listings: processedListings,
    });
  } catch (error) {
    next(error);
  }
}

export async function getListingById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, error: 'Invalid listing identifier format.' });
      return;
    }

    const listing = await FoodListing.findById(id)
      .populate('ownerId', 'name organizationName email phone')
      .populate('assignedPartnerId', 'name organizationName phone partnerServiceArea');

    if (!listing) {
      res.status(404).json({ success: false, error: 'Food listing not found.' });
      return;
    }

    checkAndApplyExpiration(listing);

    res.json({
      success: true,
      listing: sanitizeListingForUser(listing, req.user),
    });
  } catch (error) {
    next(error);
  }
}

export async function updateListing(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, error: 'Invalid listing identifier format.' });
      return;
    }

    const listing = await FoodListing.findById(id);
    if (!listing) {
      res.status(404).json({ success: false, error: 'Food listing not found.' });
      return;
    }

    // Ownership check
    const isOwner = req.user && listing.ownerId.toString() === req.user._id.toString();
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      res.status(403).json({ success: false, error: 'Forbidden: You do not own this listing.' });
      return;
    }

    // State check
    if (['assigned', 'collected', 'delivered'].includes(listing.status)) {
      res.status(409).json({
        success: false,
        error: `Cannot modify listing details while in '${listing.status}' status with an active partner assignment.`,
      });
      return;
    }

    // Allowed update fields only (mass assignment protection)
    const allowedUpdates = [
      'eventName',
      'eventType',
      'foodTitle',
      'foodCategory',
      'description',
      'quantity',
      'unit',
      'storageConditions',
      'allergenNotes',
      'collectionDeadline',
      'areaOrAddress',
      'pickupInstructions',
    ];

    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        (listing as any)[key] = req.body[key];
      }
    }

    await listing.save();

    res.json({
      success: true,
      message: 'Listing updated successfully.',
      listing: sanitizeListingForUser(listing, req.user),
    });
  } catch (error) {
    next(error);
  }
}

export async function cancelListing(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const { reason = 'Cancelled by organizer' } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, error: 'Invalid listing identifier format.' });
      return;
    }

    const listing = await FoodListing.findById(id);
    if (!listing) {
      res.status(404).json({ success: false, error: 'Food listing not found.' });
      return;
    }

    const isOwner = req.user && listing.ownerId.toString() === req.user._id.toString();
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      res.status(403).json({ success: false, error: 'Forbidden: You do not own this listing.' });
      return;
    }

    if (['collected', 'delivered'].includes(listing.status)) {
      res.status(409).json({
        success: false,
        error: `Cannot cancel a listing that is already ${listing.status}.`,
      });
      return;
    }

    listing.status = 'cancelled';
    await listing.save();

    res.json({
      success: true,
      message: 'Listing cancelled successfully.',
      listing: sanitizeListingForUser(listing, req.user),
      reason,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCandidatePartners(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, error: 'Invalid listing identifier format.' });
      return;
    }

    const listing = await FoodListing.findById(id);
    if (!listing) {
      res.status(404).json({ success: false, error: 'Food listing not found.' });
      return;
    }

    // Fetch recovery partners
    const partners = await User.find({ role: 'partner' });

    // Execute explainable rule-based matching
    const rankedPartners = rankPartnersForListing(listing, partners);

    res.json({
      success: true,
      engine: 'BhojanSetu Smart Rescue Engine (Rule-Based, Non-ML)',
      listingId: listing._id,
      candidates: rankedPartners,
      disclaimer:
        'Ranking is generated from deterministic business rules (verification, capacity fit, deadline urgency, service area). Human coordination and physical inspection remain mandatory.',
    });
  } catch (error) {
    next(error);
  }
}
