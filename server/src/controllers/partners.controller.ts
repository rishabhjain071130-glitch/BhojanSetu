import { Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { User } from '../models/User.js';
import { AuthRequest } from '../middleware/auth.js';

export async function getPartnerProfile(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    res.json({
      success: true,
      partner: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        organizationName: req.user.organizationName,
        phone: req.user.phone,
        verificationStatus: req.user.verificationStatus,
        verificationNote: req.user.verificationNote,
        partnerCapacity: req.user.partnerCapacity,
        partnerServiceArea: req.user.partnerServiceArea,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePartnerProfile(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    const { organizationName, phone, partnerCapacity, partnerServiceArea } = req.body;

    if (organizationName !== undefined) req.user.organizationName = organizationName;
    if (phone !== undefined) req.user.phone = phone;
    if (partnerCapacity !== undefined && Number(partnerCapacity) > 0) {
      req.user.partnerCapacity = Number(partnerCapacity);
    }
    if (partnerServiceArea !== undefined) req.user.partnerServiceArea = partnerServiceArea;

    await req.user.save();

    res.json({
      success: true,
      message: 'Partner profile updated successfully.',
      partner: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        organizationName: req.user.organizationName,
        phone: req.user.phone,
        verificationStatus: req.user.verificationStatus,
        verificationNote: req.user.verificationNote,
        partnerCapacity: req.user.partnerCapacity,
        partnerServiceArea: req.user.partnerServiceArea,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function submitVerification(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    const { note = 'Partner verification request submitted with organization documents' } = req.body;

    req.user.verificationStatus = 'pending';
    req.user.verificationNote = note;
    await req.user.save();

    res.json({
      success: true,
      message: 'Verification request submitted. Platform admin review is in progress.',
      verificationStatus: req.user.verificationStatus,
      verificationNote: req.user.verificationNote,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAdminPartners(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { status } = req.query;
    const query: any = { role: 'partner' };

    if (status && typeof status === 'string' && status !== 'all') {
      query.verificationStatus = status;
    }

    const partners = await User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      partners,
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePartnerVerificationByAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const { status, note } = req.body; // 'verified' | 'rejected' | 'pending'

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, error: 'Invalid partner identifier format.' });
      return;
    }

    const partner = await User.findById(id);
    if (!partner || partner.role !== 'partner') {
      res.status(404).json({ success: false, error: 'Recovery partner account not found.' });
      return;
    }

    partner.verificationStatus = status;
    if (note !== undefined) {
      partner.verificationNote = note;
    }
    await partner.save();

    res.json({
      success: true,
      message: `Partner status updated to '${status}'.`,
      partner: {
        id: partner._id,
        name: partner.name,
        email: partner.email,
        organizationName: partner.organizationName,
        verificationStatus: partner.verificationStatus,
        verificationNote: partner.verificationNote,
      },
    });
  } catch (error) {
    next(error);
  }
}
