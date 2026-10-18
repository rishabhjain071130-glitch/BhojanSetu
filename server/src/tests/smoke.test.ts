import http from 'http';
import app from '../index.js';
import mongoose from 'mongoose';

async function runTests() {
  console.log('\n🧪 ========================================================');
  console.log('🧪 Starting BhojanSetu End-to-End API Smoke Test Suite');
  console.log('🧪 ========================================================\n');

  // Let the DB connect and app initialize
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Reset pending partner for idempotent test execution
  await mongoose.model('User').updateOne(
    { email: 'partner.pending@bhojansetu.demo' },
    { $set: { verificationStatus: 'pending' } }
  );

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(5099, resolve));
  const baseUrl = 'http://localhost:5099/api';

  let organizerToken = '';
  let verifiedPartnerToken = '';
  let pendingPartnerToken = '';
  let adminToken = '';
  let testListingId = '';
  let testRequestId = '';

  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  function assert(condition: boolean, msg: string) {
    if (!condition) throw new Error(msg);
  }

  // 1. Health endpoint
  await test('GET /api/health responds with healthy status', async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.status === 'healthy', 'Expected status to be healthy');
    assert(data.database.connected === true, 'Expected database.connected to be true');
  });

  // 2. Auth: Login as Organizer
  await test('POST /api/auth/login works for seeded demo organizer', async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'organizer@bhojansetu.demo',
        password: 'Password123!',
      }),
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.token, 'Expected JWT token in response');
    assert(data.user.role === 'organizer', 'Expected role organizer');
    organizerToken = data.token;
  });

  // 3. Auth: Login as Verified Partner
  await test('POST /api/auth/login works for seeded verified partner', async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'partner.verified@bhojansetu.demo',
        password: 'Password123!',
      }),
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.user.verificationStatus === 'verified', 'Expected status verified');
    verifiedPartnerToken = data.token;
  });

  // 4. Auth: Login as Pending Partner
  await test('POST /api/auth/login works for seeded pending partner', async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'partner.pending@bhojansetu.demo',
        password: 'Password123!',
      }),
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.user.verificationStatus === 'pending', 'Expected status pending');
    pendingPartnerToken = data.token;
  });

  // 5. Auth: Login as Admin
  await test('POST /api/auth/login works for seeded platform admin', async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@bhojansetu.demo',
        password: 'Password123!',
      }),
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.user.role === 'admin', 'Expected role admin');
    adminToken = data.token;
  });

  // 6. Security & Validation: Reject invalid listing (past deadline)
  await test('POST /api/listings rejects listing with past collection deadline (400)', async () => {
    const pastTime = new Date(Date.now() - 3600000).toISOString();
    const res = await fetch(`${baseUrl}/listings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${organizerToken}`,
      },
      body: JSON.stringify({
        eventName: 'Invalid Event',
        eventType: 'wedding',
        foodTitle: 'Stale Food',
        foodCategory: 'cooked_meals',
        description: 'Test invalid listing',
        quantity: 20,
        unit: 'kg',
        preparedAt: new Date(Date.now() - 7200000).toISOString(),
        storageConditions: 'Ambient temperature',
        collectionDeadline: pastTime,
        areaOrAddress: 'Saket',
        pickupInstructions: 'Gate 2',
      }),
    });
    assert(res.status === 400, `Expected 400 validation error, got ${res.status}`);
    const data = await res.json();
    assert(data.details.some((d: any) => d.field === 'collectionDeadline'), 'Expected error on collectionDeadline');
  });

  // 7. Core Journey Step 1: Organizer creates valid surplus food listing
  await test('POST /api/listings creates valid surplus food listing', async () => {
    const futureDeadline = new Date(Date.now() + 4 * 3600000).toISOString();
    const res = await fetch(`${baseUrl}/listings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${organizerToken}`,
      },
      body: JSON.stringify({
        eventName: 'Annual Charity Dinner (Smoke Test)',
        eventType: 'banquet',
        foodTitle: 'Dal Tadka, Mix Veg Curry & Rotis (Smoke Test)',
        foodCategory: 'cooked_meals',
        description: 'Untouched freshly cooked dinner buffet surplus, sealed in hot chafing pans.',
        quantity: 45,
        unit: 'kg',
        preparedAt: new Date(Date.now() - 1800000).toISOString(),
        storageConditions: 'Insulated hot containers > 65°C',
        allergenNotes: 'Gluten in rotis, dairy-free',
        collectionDeadline: futureDeadline,
        areaOrAddress: 'South Delhi - Greater Kailash II',
        pickupInstructions: 'Kitchen door behind hall 1. Contact Chef Ramesh at intercom 104.',
      }),
    });
    assert(res.status === 201, `Expected 201 Created, got ${res.status}`);
    const data = await res.json();
    assert(data.listing._id, 'Expected listing _id');
    assert(data.listing.status === 'open', 'Expected status open');
    testListingId = data.listing._id;
  });

  // 8. Privacy Check: Unassigned partner browsing listing DOES NOT see private pickup instructions
  await test('GET /api/listings/:id masks pickupInstructions for unassigned partner', async () => {
    const res = await fetch(`${baseUrl}/listings/${testListingId}`, {
      headers: { Authorization: `Bearer ${verifiedPartnerToken}` },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.listing.pickupInstructions.includes('Detailed pickup instructions will unlock'), 'Expected masked pickup instructions');
  });

  // 9. Rule-Based Matching Engine: Explainable candidate ranking
  await test('GET /api/listings/:id/candidates runs rule-based engine and returns explainable score', async () => {
    const res = await fetch(`${baseUrl}/listings/${testListingId}/candidates`, {
      headers: { Authorization: `Bearer ${organizerToken}` },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(Array.isArray(data.candidates), 'Expected candidates array');
    const verifiedCandidate = data.candidates.find((c: any) => c.eligible === true);
    assert(verifiedCandidate, 'Expected at least one eligible candidate');
    assert(verifiedCandidate.score > 0, 'Expected positive ranking score');
    assert(verifiedCandidate.reasons.length > 0, 'Expected explainable reasons');
  });

  // 10. Role Protection: Unverified partner cannot request listing
  await test('POST /api/listings/:id/requests rejects unverified partner (403)', async () => {
    const res = await fetch(`${baseUrl}/listings/${testListingId}/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${pendingPartnerToken}`,
      },
      body: JSON.stringify({
        requestedQuantity: 20,
        collectionNote: 'We want to rescue this food.',
      }),
    });
    assert(res.status === 403, `Expected 403 Forbidden, got ${res.status}`);
    const data = await res.json();
    assert(data.error.includes('pending'), 'Expected message indicating pending verification');
  });

  // 11. Oversubscription Protection: Reject request exceeding available listing quantity
  await test('POST /api/listings/:id/requests rejects request exceeding listing quantity (409)', async () => {
    const res = await fetch(`${baseUrl}/listings/${testListingId}/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${verifiedPartnerToken}`,
      },
      body: JSON.stringify({
        requestedQuantity: 500, // Available is 45 kg
        collectionNote: 'Trying to request too much.',
      }),
    });
    assert(res.status === 409, `Expected 409 Conflict, got ${res.status}`);
  });

  // 12. Core Journey Step 2: Verified Partner submits rescue request
  await test('POST /api/listings/:id/requests succeeds for verified partner', async () => {
    const res = await fetch(`${baseUrl}/listings/${testListingId}/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${verifiedPartnerToken}`,
      },
      body: JSON.stringify({
        requestedQuantity: 45,
        collectionNote: 'Dispatched 2 volunteers in insulated van. ETA 40 minutes.',
      }),
    });
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    const data = await res.json();
    assert(data.request._id, 'Expected request _id');
    assert(data.request.status === 'pending', 'Expected pending status');
    testRequestId = data.request._id;
  });

  // 13. Core Journey Step 3: Organizer approves rescue request
  await test('PATCH /api/requests/:id/decision approves request and assigns listing', async () => {
    const res = await fetch(`${baseUrl}/requests/${testRequestId}/decision`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${organizerToken}`,
      },
      body: JSON.stringify({
        status: 'approved',
        reason: 'Approved for Annapurna Seva Trust rescue team',
      }),
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.request.status === 'approved', 'Expected request approved');

    // Verify listing is now assigned
    const listingRes = await fetch(`${baseUrl}/listings/${testListingId}`, {
      headers: { Authorization: `Bearer ${organizerToken}` },
    });
    const listingData = await listingRes.json();
    assert(listingData.listing.status === 'assigned', 'Expected listing status assigned');
  });

  // 14. Privacy Check: Approved partner CAN now view private pickup instructions
  await test('GET /api/listings/:id reveals pickup instructions to assigned partner', async () => {
    const res = await fetch(`${baseUrl}/listings/${testListingId}`, {
      headers: { Authorization: `Bearer ${verifiedPartnerToken}` },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.listing.pickupInstructions.includes('Kitchen door behind hall 1'), 'Expected actual pickup instructions revealed');
  });

  // 15. Core Journey Step 4: Assigned partner records collection
  await test('PATCH /api/requests/:id/status transitions approved -> collected', async () => {
    const res = await fetch(`${baseUrl}/requests/${testRequestId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${verifiedPartnerToken}`,
      },
      body: JSON.stringify({
        status: 'collected',
        reason: 'Food inspected, temperature verified at 68°C, and loaded safely into van',
      }),
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.request.status === 'collected', 'Expected status collected');
  });

  // 16. Core Journey Step 5: Assigned partner records delivery
  await test('PATCH /api/requests/:id/status transitions collected -> delivered', async () => {
    const res = await fetch(`${baseUrl}/requests/${testRequestId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${verifiedPartnerToken}`,
      },
      body: JSON.stringify({
        status: 'delivered',
        reason: 'Meals served hot to 110 people at Okhla Community Kitchen',
      }),
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.request.status === 'delivered', 'Expected status delivered');
    assert(data.request.statusHistory.length >= 4, 'Expected statusHistory audit trail');
  });

  // 17. Impact Dashboard reflects genuine live database updates
  await test('GET /api/impact/summary computes real delivered impact and diversion', async () => {
    const res = await fetch(`${baseUrl}/impact/summary`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.summary.completedDeliveries >= 2, 'Expected completedDeliveries >= 2 (seeded + test)');
    assert(data.wasteDiversion.estimatedKgDiverted > 0, 'Expected positive estimatedKgDiverted');
    assert(data.collectedByUnit.length > 0, 'Expected units in collectedByUnit');
  });

  // 18. Admin Partner Review: Admin verifies pending partner
  await test('PATCH /api/partners/admin/:id/verification verifies partner', async () => {
    // Find pending partner user id
    const pendingUser = await mongoose.model('User').findOne({ email: 'partner.pending@bhojansetu.demo' });
    assert(pendingUser !== null, 'Expected pending partner user to exist');

    const res = await fetch(`${baseUrl}/partners/admin/${pendingUser!._id}/verification`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        status: 'verified',
        note: 'Admin verified food safety compliance declaration and NGO registration certificate.',
      }),
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.partner.verificationStatus === 'verified', 'Expected status to be verified');
  });

  console.log('\n========================================================');
  console.log(`📊 Smoke Test Results: ${passed} Passed, ${failed} Failed`);
  console.log('========================================================\n');

  server.close();
  await mongoose.disconnect();

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
