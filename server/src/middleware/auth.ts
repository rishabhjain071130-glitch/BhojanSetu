import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { User, IUser, UserRole } from '../models/User.js';

export interface AuthRequest extends Request {
  user?: IUser;
}

interface DecodedToken {
  id: string;
  role: UserRole;
  email: string;
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let token: string | undefined;

    // Check Authorization header: Bearer <token>
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.headers.cookie) {
      // Fallback: check cookie
      const cookies = req.headers.cookie.split(';');
      for (const cookie of cookies) {
        const [name, val] = cookie.trim().split('=');
        if (name === 'bhojansetu_token') {
          token = decodeURIComponent(val);
          break;
        }
      }
    }

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Authentication required. Please sign in to proceed.',
      });
      return;
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET) as DecodedToken;
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'User account not found or has been removed.',
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired authentication session. Please sign in again.',
    });
  }
}

export function requireRole(allowedRoles: UserRole | UserRole[]) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required.' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `Forbidden: Access requires ${roles.join(' or ')} privileges.`,
      });
      return;
    }

    next();
  };
}

export function requireVerifiedPartner(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Authentication required.' });
    return;
  }

  if (req.user.role !== 'partner') {
    res.status(403).json({
      success: false,
      error: 'Action restricted to recovery partners only.',
    });
    return;
  }

  if (req.user.verificationStatus !== 'verified') {
    res.status(403).json({
      success: false,
      error: `Your recovery partner account is currently '${req.user.verificationStatus}'. Partner verification approval by admin is required before requesting food rescue listings.`,
    });
    return;
  }

  next();
}
