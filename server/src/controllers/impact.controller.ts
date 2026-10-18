import { Request, Response, NextFunction } from 'express';
import { FoodListing } from '../models/FoodListing.js';
import { RecoveryRequest } from '../models/RecoveryRequest.js';
import { User } from '../models/User.js';

export async function getImpactSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 1. Overall counts by listing status
    const statusCounts = await FoodListing.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statusMap: Record<string, number> = {
      open: 0,
      requested: 0,
      assigned: 0,
      collected: 0,
      delivered: 0,
      cancelled: 0,
      expired: 0,
    };

    statusCounts.forEach((sc) => {
      if (sc._id) statusMap[sc._id] = sc.count;
    });

    const totalListings = Object.values(statusMap).reduce((a, b) => a + b, 0);

    // 2. Quantity offered grouped by unit (Preserves unit fidelity!)
    const offeredByUnit = await FoodListing.aggregate([
      {
        $group: {
          _id: '$unit',
          totalQuantity: { $sum: '$quantity' },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalQuantity: -1 } },
    ]);

    // 3. Quantity collected & delivered grouped by unit
    const collectedByUnit = await FoodListing.aggregate([
      {
        $match: {
          status: { $in: ['collected', 'delivered'] },
        },
      },
      {
        $group: {
          _id: '$unit',
          totalQuantity: { $sum: '$quantity' },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalQuantity: -1 } },
    ]);

    // 4. Partner & Organizer participation counts
    const [totalPartners, verifiedPartners, totalOrganizers] = await Promise.all([
      User.countDocuments({ role: 'partner' }),
      User.countDocuments({ role: 'partner', verificationStatus: 'verified' }),
      User.countDocuments({ role: 'organizer' }),
    ]);

    // 5. Explicitly calculated waste diversion estimate
    // Standard conversion: 1 serving ≈ 0.40 kg; 1 meal box ≈ 0.45 kg; kg is 1:1
    let estimatedKgDiverted = 0;
    collectedByUnit.forEach((item) => {
      if (item._id === 'kg') {
        estimatedKgDiverted += item.totalQuantity;
      } else if (item._id === 'servings') {
        estimatedKgDiverted += item.totalQuantity * 0.4;
      } else if (item._id === 'meal_boxes') {
        estimatedKgDiverted += item.totalQuantity * 0.45;
      } else if (item._id === 'trays') {
        estimatedKgDiverted += item.totalQuantity * 4.0;
      }
    });

    // 6. Food Category breakdown for authentic charting
    const categoryBreakdown = await FoodListing.aggregate([
      {
        $group: {
          _id: '$foodCategory',
          count: { $sum: 1 },
        },
      },
    ]);

    // 7. Recent rescue activity feed
    const recentActivity = await RecoveryRequest.find()
      .populate('partnerId', 'name organizationName')
      .populate('listingId', 'foodTitle eventName areaOrAddress unit quantity')
      .sort({ updatedAt: -1 })
      .limit(8);

    res.json({
      success: true,
      dataSource: 'Live Database Records (MongoDB)',
      summary: {
        totalListings,
        activeListings: (statusMap['open'] || 0) + (statusMap['requested'] || 0),
        inProgressPickups: statusMap['assigned'] || 0,
        completedDeliveries: statusMap['delivered'] || 0,
        collectedListings: statusMap['collected'] || 0,
        expiredOrCancelled: (statusMap['expired'] || 0) + (statusMap['cancelled'] || 0),
        totalPartners,
        verifiedPartners,
        totalOrganizers,
      },
      statusBreakdown: statusMap,
      offeredByUnit: offeredByUnit.map((u) => ({
        unit: u._id,
        quantity: Math.round(u.totalQuantity * 10) / 10,
        listingsCount: u.count,
      })),
      collectedByUnit: collectedByUnit.map((u) => ({
        unit: u._id,
        quantity: Math.round(u.totalQuantity * 10) / 10,
        listingsCount: u.count,
      })),
      categoryBreakdown: categoryBreakdown.map((c) => ({
        category: c._id,
        count: c.count,
      })),
      wasteDiversion: {
        estimatedKgDiverted: Math.round(estimatedKgDiverted),
        formulaExplanation:
          'Formula: 1.0 kg/kg + 0.40 kg/serving + 0.45 kg/meal_box + 4.0 kg/tray for verified collected and delivered items.',
        label: 'Estimated waste diversion (formula-derived from reported quantities)',
      },
      recentActivity: recentActivity.map((r: any) => ({
        id: r._id,
        status: r.status,
        requestedQuantity: r.requestedQuantity,
        partnerName: r.partnerId?.organizationName || r.partnerId?.name || 'Partner',
        foodTitle: r.listingId?.foodTitle || 'Surplus Food',
        eventName: r.listingId?.eventName || 'Event',
        unit: r.listingId?.unit || 'units',
        updatedAt: r.updatedAt,
      })),
      notes: {
        pilotedNotice:
          'Data is computed strictly from database records. Metrics are transparently categorized as Reported vs Estimated.',
      },
    });
  } catch (error) {
    next(error);
  }
}
