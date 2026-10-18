import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';
import { ENV } from '../config/env.js';
import { AuthRequest } from '../middleware/auth.js';

function generateToken(user: IUser): string {
  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    },
    ENV.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function sanitizeUser(user: IUser) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    organizationName: user.organizationName || '',
    phone: user.phone || '',
    verificationStatus: user.verificationStatus,
    verificationNote: user.verificationNote || '',
    partnerCapacity: user.partnerCapacity || 0,
    partnerServiceArea: user.partnerServiceArea || '',
    createdAt: user.createdAt,
  };
}

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      name,
      email,
      password,
      role,
      organizationName,
      phone,
      partnerCapacity,
      partnerServiceArea,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        success: false,
        error: 'An account with this email address already exists.',
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      passwordHash,
      role,
      organizationName,
      phone,
      partnerCapacity: role === 'partner' ? partnerCapacity || 150 : undefined,
      partnerServiceArea: role === 'partner' ? partnerServiceArea || 'Central' : undefined,
      verificationStatus: role === 'partner' ? 'pending' : 'verified',
    });

    const token = generateToken(newUser);

    // Set HTTP-only cookie
    res.cookie('bhojansetu_token', token, {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: sanitizeUser(newUser),
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password credentials.',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password credentials.',
      });
      return;
    }

    const token = generateToken(user);

    res.cookie('bhojansetu_token', token, {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: 'Signed in successfully.',
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
}

export function logout(req: Request, res: Response): void {
  res.clearCookie('bhojansetu_token');
  res.json({
    success: true,
    message: 'Logged out successfully.',
  });
}

export function getMe(req: AuthRequest, res: Response): void {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated.' });
    return;
  }

  res.json({
    success: true,
    user: sanitizeUser(req.user),
  });
}

export async function getDemoAccounts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const demoUsers = await User.find({
      email: {
        $in: [
          'organizer@bhojansetu.demo',
          'partner.verified@bhojansetu.demo',
          'partner.pending@bhojansetu.demo',
          'admin@bhojansetu.demo',
        ],
      },
    });

    const accounts = demoUsers.map((u) => ({
      email: u.email,
      role: u.role,
      name: u.name,
      organizationName: u.organizationName,
      verificationStatus: u.verificationStatus,
      defaultPassword: 'Password123!',
    }));

    res.json({
      success: true,
      isDemoMode: true,
      accounts,
    });
  } catch (error) {
    next(error);
  }
}
