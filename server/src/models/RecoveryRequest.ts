import mongoose, { Schema, Document, Types } from 'mongoose';

export type RequestStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'collected'
  | 'delivered';

export interface IStatusHistoryItem {
  actor: Types.ObjectId;
  actorRole: string;
  actorName: string;
  previousStatus: string;
  newStatus: string;
  timestamp: Date;
  reason?: string;
}

export interface IRecoveryRequest extends Document {
  listingId: Types.ObjectId;
  partnerId: Types.ObjectId;
  requestedQuantity: number;
  collectionNote: string;
  status: RequestStatus;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
  collectedAt?: Date;
  deliveredAt?: Date;
  statusHistory: IStatusHistoryItem[];
  createdAt: Date;
  updatedAt: Date;
}

const statusHistorySchema = new Schema<IStatusHistoryItem>(
  {
    actor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    actorRole: {
      type: String,
      required: true,
    },
    actorName: {
      type: String,
      required: true,
    },
    previousStatus: {
      type: String,
      required: true,
    },
    newStatus: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    reason: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const recoveryRequestSchema = new Schema<IRecoveryRequest>(
  {
    listingId: {
      type: Schema.Types.ObjectId,
      ref: 'FoodListing',
      required: true,
      index: true,
    },
    partnerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    requestedQuantity: {
      type: Number,
      required: [true, 'Requested quantity is required'],
      min: [0.1, 'Requested quantity must be positive'],
    },
    collectionNote: {
      type: String,
      required: [true, 'Collection note is required'],
      trim: true,
      maxlength: [500, 'Collection note cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled', 'collected', 'delivered'],
      default: 'pending',
      index: true,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
    collectedAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
recoveryRequestSchema.index({ listingId: 1, partnerId: 1 });
recoveryRequestSchema.index({ status: 1, createdAt: -1 });

export const RecoveryRequest = mongoose.model<IRecoveryRequest>(
  'RecoveryRequest',
  recoveryRequestSchema
);
