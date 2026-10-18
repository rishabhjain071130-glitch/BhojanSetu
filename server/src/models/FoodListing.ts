import mongoose, { Schema, Document, Types } from 'mongoose';

export type EventType = 'wedding' | 'banquet' | 'catering' | 'college' | 'community' | 'other';
export type FoodCategory =
  | 'cooked_meals'
  | 'packaged_ration'
  | 'bakery'
  | 'desserts'
  | 'fruits_vegetables'
  | 'beverages'
  | 'other';
export type QuantityUnit = 'kg' | 'servings' | 'meal_boxes' | 'trays' | 'other';
export type ListingStatus =
  | 'open'
  | 'requested'
  | 'assigned'
  | 'collected'
  | 'delivered'
  | 'cancelled'
  | 'expired';

export interface IFoodListing extends Document {
  ownerId: Types.ObjectId;
  eventName: string;
  eventType: EventType;
  foodTitle: string;
  foodCategory: FoodCategory;
  description: string;
  quantity: number;
  unit: QuantityUnit;
  preparedAt: Date;
  storageConditions: string;
  allergenNotes?: string;
  collectionDeadline: Date;
  areaOrAddress: string;
  pickupInstructions: string;
  status: ListingStatus;
  allocatedQuantity: number;
  assignedPartnerId?: Types.ObjectId;
  assignedRequestId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const foodListingSchema = new Schema<IFoodListing>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    eventName: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
      maxlength: [120, 'Event name cannot exceed 120 characters'],
    },
    eventType: {
      type: String,
      enum: ['wedding', 'banquet', 'catering', 'college', 'community', 'other'],
      default: 'catering',
      required: true,
    },
    foodTitle: {
      type: String,
      required: [true, 'Food title is required'],
      trim: true,
      maxlength: [140, 'Food title cannot exceed 140 characters'],
    },
    foodCategory: {
      type: String,
      enum: [
        'cooked_meals',
        'packaged_ration',
        'bakery',
        'desserts',
        'fruits_vegetables',
        'beverages',
        'other',
      ],
      default: 'cooked_meals',
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0.1, 'Quantity must be a positive number'],
    },
    unit: {
      type: String,
      enum: ['kg', 'servings', 'meal_boxes', 'trays', 'other'],
      default: 'kg',
      required: true,
    },
    preparedAt: {
      type: Date,
      required: [true, 'Preparation date/time is required'],
    },
    storageConditions: {
      type: String,
      required: [true, 'Storage & handling conditions are required'],
      trim: true,
      maxlength: [300, 'Storage conditions cannot exceed 300 characters'],
    },
    allergenNotes: {
      type: String,
      trim: true,
      default: '',
      maxlength: [300, 'Allergen notes cannot exceed 300 characters'],
    },
    collectionDeadline: {
      type: Date,
      required: [true, 'Collection deadline is required'],
      index: true,
    },
    areaOrAddress: {
      type: String,
      required: [true, 'Approximate area or locality is required'],
      trim: true,
      maxlength: [150, 'Area cannot exceed 150 characters'],
    },
    pickupInstructions: {
      type: String,
      required: [true, 'Pickup instructions are required'],
      trim: true,
      maxlength: [500, 'Pickup instructions cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: ['open', 'requested', 'assigned', 'collected', 'delivered', 'cancelled', 'expired'],
      default: 'open',
      index: true,
    },
    allocatedQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    assignedPartnerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    assignedRequestId: {
      type: Schema.Types.ObjectId,
      ref: 'RecoveryRequest',
    },
  },
  {
    timestamps: true,
  }
);

// Helpful compound indexes
foodListingSchema.index({ status: 1, collectionDeadline: 1 });
foodListingSchema.index({ areaOrAddress: 'text', foodTitle: 'text', eventName: 'text' });

export const FoodListing = mongoose.model<IFoodListing>('FoodListing', foodListingSchema);
