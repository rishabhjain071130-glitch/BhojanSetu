import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { FoodListing } from '../models/FoodListing.js';
import { RecoveryRequest } from '../models/RecoveryRequest.js';

async function seedDatabase() {
  console.log('🌱 Starting BhojanSetu demo database seeding...');
  await connectDB();

  // Clear existing collections safely
  console.log('🧹 Clearing previous demo data...');
  await Promise.all([
    User.deleteMany({}),
    FoodListing.deleteMany({}),
    RecoveryRequest.deleteMany({}),
  ]);

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Password123!', salt);

  console.log('👥 Creating demo user accounts...');
  // 1. Organizer
  const organizer = await User.create({
    name: 'Aarav Sharma (Demo Organizer)',
    email: 'organizer@bhojansetu.demo',
    passwordHash,
    role: 'organizer',
    organizationName: 'Royal Grand Banquets (Demo Caterer)',
    phone: '+91 98765 43210',
    verificationStatus: 'verified',
  });

  // 2. Verified Recovery Partner
  const partnerVerified = await User.create({
    name: 'Priya Nair (Demo Partner)',
    email: 'partner.verified@bhojansetu.demo',
    passwordHash,
    role: 'partner',
    organizationName: 'Annapurna Seva Trust (Demo NGO)',
    phone: '+91 98111 22334',
    verificationStatus: 'verified',
    verificationNote: 'Demo partner verified with local civil society registration and food handler guidelines',
    partnerCapacity: 250,
    partnerServiceArea: 'South Delhi',
  });

  // 3. Unverified Pending Partner
  const partnerPending = await User.create({
    name: 'Vikram Das (Demo Partner Pending)',
    email: 'partner.pending@bhojansetu.demo',
    passwordHash,
    role: 'partner',
    organizationName: 'Navjeevan Food Rescue (Demo Unverified)',
    phone: '+91 98222 33445',
    verificationStatus: 'pending',
    verificationNote: 'Application submitted, awaiting admin review',
    partnerCapacity: 80,
    partnerServiceArea: 'East Delhi',
  });

  // 4. Admin Coordinator
  const admin = await User.create({
    name: 'Devraj Patel (Demo Admin)',
    email: 'admin@bhojansetu.demo',
    passwordHash,
    role: 'admin',
    organizationName: 'BhojanSetu Coordination Desk',
    phone: '+91 99000 11223',
    verificationStatus: 'verified',
  });

  console.log('🍱 Creating demo food listings...');
  const now = Date.now();

  // Listing 1: Active open listing (urgent)
  const listing1 = await FoodListing.create({
    ownerId: organizer._id,
    eventName: 'Sharma-Verma Wedding Reception (Demo)',
    eventType: 'wedding',
    foodTitle: 'Paneer Butter Masala & Steamed Jeera Rice (Demo)',
    foodCategory: 'cooked_meals',
    description:
      'Fresh untouched vegetarian dinner surplus from evening buffet. Stored safely in food-grade hot containers.',
    quantity: 50,
    unit: 'kg',
    preparedAt: new Date(now - 2 * 60 * 60 * 1000), // prepared 2h ago
    storageConditions: 'Held in covered insulated chafing food pans above 65°C',
    allergenNotes: 'Contains dairy (milk, paneer, butter). Nut-free, gluten-free.',
    collectionDeadline: new Date(now + 3 * 60 * 60 * 1000), // deadline in 3h
    areaOrAddress: 'South Delhi - Saket Banquet Zone',
    pickupInstructions: 'Rear kitchen loading dock, gate 3. Ask for Executive Chef Aarav.',
    status: 'open',
    allocatedQuantity: 0,
  });

  // Listing 2: Active open listing (high urgency)
  const listing2 = await FoodListing.create({
    ownerId: organizer._id,
    eventName: 'National Tech Summit Dinner (Demo)',
    eventType: 'banquet',
    foodTitle: 'Subz Dum Biryani & Dal Makhani (Demo)',
    foodCategory: 'cooked_meals',
    description:
      'High-grade vegetable dum biryani with raita and slow-cooked dal makhani prepared for 300 guests, 35 kg surplus.',
    quantity: 35,
    unit: 'kg',
    preparedAt: new Date(now - 1.5 * 60 * 60 * 1000),
    storageConditions: 'Sealed stainless steel thermal warming vessels',
    allergenNotes: 'Contains dairy and spices. No nuts.',
    collectionDeadline: new Date(now + 1.8 * 60 * 60 * 1000), // deadline in 1.8h
    areaOrAddress: 'Central - Connaught Place Hall B',
    pickupInstructions: 'Banquet service elevator entrance on Barakhamba Road.',
    status: 'open',
    allocatedQuantity: 0,
  });

  // Listing 3: Packaged bakery surplus
  const listing3 = await FoodListing.create({
    ownerId: organizer._id,
    eventName: 'Corporate Leadership Forum (Demo)',
    eventType: 'catering',
    foodTitle: 'Sealed Whole Wheat Muffins & Croissants (Demo)',
    foodCategory: 'bakery',
    description:
      'Individually boxed fresh continental breakfast pastries and banana walnut muffins, completely untouched.',
    quantity: 120,
    unit: 'meal_boxes',
    preparedAt: new Date(now - 4 * 60 * 60 * 1000),
    storageConditions: 'Air-tight sealed individual food-grade boxes, ambient room temperature 22°C',
    allergenNotes: 'Contains gluten, eggs, and walnuts.',
    collectionDeadline: new Date(now + 8 * 60 * 60 * 1000), // deadline in 8h
    areaOrAddress: 'South Delhi - Nehru Place Tech Centre',
    pickupInstructions: 'Security check desk at Tower 2 lobby. Pre-cleared gate pass with reception.',
    status: 'open',
    allocatedQuantity: 0,
  });

  // Listing 4: Completed historical rescue for impact metrics
  const listing4 = await FoodListing.create({
    ownerId: organizer._id,
    eventName: 'Inter-College Festival Gala Dinner (Demo)',
    eventType: 'college',
    foodTitle: 'Mixed Vegetable Pulao & Rajma Curry (Demo)',
    foodCategory: 'cooked_meals',
    description: 'Hot nutritious meal surplus successfully redistributed to local community shelter.',
    quantity: 65,
    unit: 'kg',
    preparedAt: new Date(now - 28 * 60 * 60 * 1000),
    storageConditions: 'Refrigerated and transferred in temperature-controlled insulated totes',
    allergenNotes: 'Vegetarian, nut-free, dairy-free.',
    collectionDeadline: new Date(now - 22 * 60 * 60 * 1000),
    areaOrAddress: 'North Campus University Grounds',
    pickupInstructions: 'Dining hall gate 1',
    status: 'delivered',
    allocatedQuantity: 65,
    assignedPartnerId: partnerVerified._id,
  });

  // Request for Listing 4
  const req4 = await RecoveryRequest.create({
    listingId: listing4._id,
    partnerId: partnerVerified._id,
    requestedQuantity: 65,
    collectionNote: 'Dispatched thermal insulated electric van with 2 recovery volunteers.',
    status: 'delivered',
    approvedBy: organizer._id,
    approvedAt: new Date(now - 26 * 60 * 60 * 1000),
    collectedAt: new Date(now - 25 * 60 * 60 * 1000),
    deliveredAt: new Date(now - 24 * 60 * 60 * 1000),
    statusHistory: [
      {
        actor: partnerVerified._id,
        actorRole: 'partner',
        actorName: partnerVerified.name,
        previousStatus: 'none',
        newStatus: 'pending',
        timestamp: new Date(now - 27 * 60 * 60 * 1000),
        reason: 'Initial rescue request submitted',
      },
      {
        actor: organizer._id,
        actorRole: 'organizer',
        actorName: organizer.name,
        previousStatus: 'pending',
        newStatus: 'approved',
        timestamp: new Date(now - 26 * 60 * 60 * 1000),
        reason: 'Approved for Annapurna Seva Trust',
      },
      {
        actor: partnerVerified._id,
        actorRole: 'partner',
        actorName: partnerVerified.name,
        previousStatus: 'approved',
        newStatus: 'collected',
        timestamp: new Date(now - 25 * 60 * 60 * 1000),
        reason: 'Inspected and loaded into insulated van',
      },
      {
        actor: partnerVerified._id,
        actorRole: 'partner',
        actorName: partnerVerified.name,
        previousStatus: 'collected',
        newStatus: 'delivered',
        timestamp: new Date(now - 24 * 60 * 60 * 1000),
        reason: 'Delivered and served at community meal centre',
      },
    ],
  });

  listing4.assignedRequestId = req4._id;
  await listing4.save();

  console.log('✅ Demo seeding finished successfully!');
  console.log('--------------------------------------------------');
  console.log('Demo Credentials for Testing:');
  console.log('1. Organizer:   organizer@bhojansetu.demo        / Password123!');
  console.log('2. Partner (V): partner.verified@bhojansetu.demo / Password123!');
  console.log('3. Partner (P): partner.pending@bhojansetu.demo  / Password123!');
  console.log('4. Admin:       admin@bhojansetu.demo            / Password123!');
  console.log('--------------------------------------------------');

  await mongoose.disconnect();
}

seedDatabase().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
