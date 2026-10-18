import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'organizer' | 'partner' | 'admin';
export type VerificationStatus = 'not_submitted' | 'pending' | 'verified' | 'rejected';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  organizationName?: string;
  phone?: string;
  verificationStatus: VerificationStatus;
  verificationNote?: string;
  partnerCapacity?: number; // max units capacity for recovery partner
  partnerServiceArea?: string; // approximate service area/region
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Don't return passwordHash by default
    },
    role: {
      type: String,
      enum: ['organizer', 'partner', 'admin'],
      default: 'organizer',
      required: true,
    },
    organizationName: {
      type: String,
      trim: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    verificationStatus: {
      type: String,
      enum: ['not_submitted', 'pending', 'verified', 'rejected'],
      default: function (this: IUser) {
        return this.role === 'partner' ? 'pending' : 'verified';
      },
    },
    verificationNote: {
      type: String,
      default: '',
    },
    partnerCapacity: {
      type: Number,
      default: 150,
      min: [0, 'Capacity cannot be negative'],
    },
    partnerServiceArea: {
      type: String,
      trim: true,
      default: 'Central',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
userSchema.index({ role: 1, verificationStatus: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
