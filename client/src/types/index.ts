export type UserRole = 'organizer' | 'partner' | 'admin';
export type VerificationStatus = 'not_submitted' | 'pending' | 'verified' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationName?: string;
  phone?: string;
  verificationStatus: VerificationStatus;
  verificationNote?: string;
  partnerCapacity?: number;
  partnerServiceArea?: string;
  createdAt?: string;
}

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

export interface FoodListing {
  _id: string;
  ownerId: {
    _id: string;
    name: string;
    organizationName?: string;
    email?: string;
    phone?: string;
  } | string;
  eventName: string;
  eventType: EventType;
  foodTitle: string;
  foodCategory: FoodCategory;
  description: string;
  quantity: number;
  unit: QuantityUnit;
  preparedAt: string;
  storageConditions: string;
  allergenNotes?: string;
  collectionDeadline: string;
  areaOrAddress: string;
  pickupInstructions: string;
  status: ListingStatus;
  allocatedQuantity: number;
  assignedPartnerId?: {
    _id: string;
    name: string;
    organizationName?: string;
    phone?: string;
    partnerServiceArea?: string;
  } | string;
  assignedRequestId?: string;
  hoursRemaining?: number;
  isExpired?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type RequestStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'collected'
  | 'delivered';

export interface StatusHistoryItem {
  actor: string;
  actorRole: string;
  actorName: string;
  previousStatus: string;
  newStatus: string;
  timestamp: string;
  reason?: string;
}

export interface RecoveryRequest {
  _id: string;
  listingId: FoodListing | string;
  partnerId: {
    _id: string;
    name: string;
    organizationName?: string;
    email?: string;
    phone?: string;
    partnerCapacity?: number;
    partnerServiceArea?: string;
    verificationStatus?: string;
  } | string;
  requestedQuantity: number;
  collectionNote: string;
  status: RequestStatus;
  approvedBy?: {
    _id: string;
    name: string;
    email?: string;
  } | string;
  approvedAt?: string;
  collectedAt?: string;
  deliveredAt?: string;
  statusHistory: StatusHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CandidateScore {
  partnerId: string;
  partnerName: string;
  organizationName?: string;
  score: number;
  eligible: boolean;
  ineligibilityReason?: string;
  reasons: string[];
  capacity: number;
  serviceArea: string;
}

export interface ImpactSummary {
  dataSource: string;
  summary: {
    totalListings: number;
    activeListings: number;
    inProgressPickups: number;
    completedDeliveries: number;
    collectedListings: number;
    expiredOrCancelled: number;
    totalPartners: number;
    verifiedPartners: number;
    totalOrganizers: number;
  };
  statusBreakdown: Record<string, number>;
  offeredByUnit: Array<{ unit: string; quantity: number; listingsCount: number }>;
  collectedByUnit: Array<{ unit: string; quantity: number; listingsCount: number }>;
  categoryBreakdown: Array<{ category: string; count: number }>;
  wasteDiversion: {
    estimatedKgDiverted: number;
    formulaExplanation: string;
    label: string;
  };
  recentActivity: Array<{
    id: string;
    status: string;
    requestedQuantity: number;
    partnerName: string;
    foodTitle: string;
    eventName: string;
    unit: string;
    updatedAt: string;
  }>;
  notes: {
    pilotedNotice: string;
  };
}
