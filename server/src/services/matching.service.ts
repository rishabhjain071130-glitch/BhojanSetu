import { IFoodListing } from '../models/FoodListing.js';
import { IUser } from '../models/User.js';

export interface PartnerMatchScore {
  partnerId: string;
  partnerName: string;
  organizationName?: string;
  score: number; // 0 to 100
  eligible: boolean;
  ineligibilityReason?: string;
  reasons: string[];
  capacity: number;
  serviceArea: string;
}

/**
 * Smart Rescue Engine (Rule-Based, Non-ML)
 * Evaluates candidate recovery partners for a surplus food listing based on
 * deterministic, explainable operational criteria.
 */
export function rankPartnersForListing(
  listing: IFoodListing,
  partners: IUser[]
): PartnerMatchScore[] {
  const now = new Date().getTime();
  const deadlineTime = new Date(listing.collectionDeadline).getTime();
  const hoursUntilDeadline = (deadlineTime - now) / (1000 * 60 * 60);

  const results: PartnerMatchScore[] = partners.map((partner) => {
    const reasons: string[] = [];
    let eligible = true;
    let ineligibilityReason: string | undefined;

    // Gate 1: Partner verification status
    if (partner.verificationStatus !== 'verified') {
      eligible = false;
      ineligibilityReason = `Partner is not verified (status: ${partner.verificationStatus})`;
    }

    // Gate 2: Collection deadline check
    if (hoursUntilDeadline <= 0) {
      eligible = false;
      ineligibilityReason = 'Collection deadline has passed for this listing';
    }

    // Gate 3: Listing status check
    if (listing.status !== 'open' && listing.status !== 'requested') {
      eligible = false;
      ineligibilityReason = `Listing is currently ${listing.status} and not accepting new partner matches`;
    }

    // Gate 4: Partner capacity check
    const partnerCapacity = partner.partnerCapacity || 100;
    const remainingQuantity = Math.max(0, listing.quantity - (listing.allocatedQuantity || 0));

    if (partnerCapacity < remainingQuantity * 0.5) {
      // If partner capacity is less than 50% of the remaining food, they cannot handle the load safely
      reasons.push(`Partial capacity (${partnerCapacity} ${listing.unit}) vs listing (${remainingQuantity} ${listing.unit})`);
    }

    if (!eligible) {
      return {
        partnerId: partner._id.toString(),
        partnerName: partner.name,
        organizationName: partner.organizationName || partner.name,
        score: 0,
        eligible: false,
        ineligibilityReason,
        reasons: ineligibilityReason ? [ineligibilityReason] : [],
        capacity: partnerCapacity,
        serviceArea: partner.partnerServiceArea || 'General',
      };
    }

    // Scoring calculation for eligible partners (Scale: 0 to 100)
    let score = 40; // Base score for being an active verified partner
    reasons.push('Verified recovery partner in good standing');

    // 1. Capacity fit (up to 25 points)
    if (partnerCapacity >= remainingQuantity) {
      score += 25;
      reasons.push(`Full rescue capacity available (${partnerCapacity} ${listing.unit} capacity)`);
    } else {
      const capacityRatio = partnerCapacity / remainingQuantity;
      const capacityPoints = Math.round(capacityRatio * 20);
      score += capacityPoints;
      reasons.push(`Partial capacity fit (${Math.round(capacityRatio * 100)}% load coverage)`);
    }

    // 2. Urgency / Deadline factor (up to 20 points)
    if (hoursUntilDeadline <= 2) {
      score += 20;
      reasons.push(`High urgency match: deadline expires in under 2 hours`);
    } else if (hoursUntilDeadline <= 5) {
      score += 15;
      reasons.push(`Urgent match: deadline expires in ${Math.round(hoursUntilDeadline)} hours`);
    } else {
      score += 10;
      reasons.push(`Standard window: ${Math.round(hoursUntilDeadline)} hours until deadline`);
    }

    // 3. Service Area proximity match (up to 15 points)
    const partnerArea = (partner.partnerServiceArea || '').toLowerCase().trim();
    const listingArea = (listing.areaOrAddress || '').toLowerCase().trim();

    if (
      partnerArea &&
      listingArea &&
      (listingArea.includes(partnerArea) || partnerArea.includes(listingArea))
    ) {
      score += 15;
      reasons.push(`Direct service area alignment (${partner.partnerServiceArea})`);
    } else {
      score += 5;
      reasons.push('Operating within metropolitan zone');
    }

    return {
      partnerId: partner._id.toString(),
      partnerName: partner.name,
      organizationName: partner.organizationName || partner.name,
      score: Math.min(100, score),
      eligible: true,
      reasons,
      capacity: partnerCapacity,
      serviceArea: partner.partnerServiceArea || 'General',
    };
  });

  // Sort descending by score
  return results.sort((a, b) => b.score - a.score);
}
