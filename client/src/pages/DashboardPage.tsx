import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { request } from '../api/client.js';
import { FoodListing, RecoveryRequest, ImpactSummary, User } from '../types/index.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { UrgencyBadge } from '../components/UrgencyBadge.js';
import { LoadingSpinner } from '../components/LoadingSpinner.js';
import { EmptyState } from '../components/EmptyState.js';
import { ErrorAlert } from '../components/ErrorAlert.js';
import { FoodSafetyBanner } from '../components/FoodSafetyBanner.js';
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowRight,
  ShieldCheck,
  Building2,
  HeartHandshake,
  Users,
  Search,
  ChefHat,
  Thermometer,
  Calendar,
  Layers,
  MapPin,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [myListings, setMyListings] = useState<FoodListing[]>([]);
  const [availableListings, setAvailableListings] = useState<FoodListing[]>([]);
  const [myRequests, setMyRequests] = useState<RecoveryRequest[]>([]);
  const [impact, setImpact] = useState<ImpactSummary | null>(null);
  const [pendingPartners, setPendingPartners] = useState<User[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);

      // Shared impact summary
      const impactData = await request<ImpactSummary>('/impact/summary');
      setImpact(impactData);

      if (user.role === 'organizer') {
        const listingsRes = await request<{ listings: FoodListing[] }>(
          '/listings?ownerOnly=true&limit=20'
        );
        setMyListings(listingsRes.listings || []);
      } else if (user.role === 'partner') {
        const [listingsRes, requestsRes] = await Promise.all([
          request<{ listings: FoodListing[] }>('/listings?status=open&limit=10'),
          request<{ requests: RecoveryRequest[] }>('/requests/mine'),
        ]);
        setAvailableListings(listingsRes.listings || []);
        setMyRequests(requestsRes.requests || []);
      } else if (user.role === 'admin') {
        const [listingsRes, partnersRes] = await Promise.all([
          request<{ listings: FoodListing[] }>('/listings?limit=20'),
          request<{ partners: User[] }>('/partners/admin?status=pending'),
        ]);
        setMyListings(listingsRes.listings || []);
        setPendingPartners(partnersRes.partners || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard records.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-fade-in">
      {/* Greeting & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E8E1]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#287653] bg-[#DDEBDD] px-3 py-0.5 rounded-full border border-[#287653]/15">
              {user.role} Workspace
            </span>
            {user.role === 'partner' && (
              <StatusBadge status={user.verificationStatus} type="verification" size="sm" />
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#202820] tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#667067] mt-0.5">
            {user.organizationName ? `${user.organizationName} • ` : ''}
            Verified surplus food recovery operational desk
          </p>
        </div>

        <div className="flex items-center gap-3">
          {user.role === 'organizer' && (
            <Link
              to="/listings/create"
              className="btn-primary-brand text-xs sm:text-sm"
            >
              <PlusCircle className="w-4 h-4 text-[#DDEBDD]" /> Donate Surplus Food
            </Link>
          )}

          {user.role === 'partner' && (
            <Link
              to="/listings"
              className="btn-primary-brand text-xs sm:text-sm"
            >
              <Search className="w-4 h-4 text-[#DDEBDD]" /> Discover Available Food
            </Link>
          )}

          {user.role === 'admin' && (
            <Link
              to="/admin/partners"
              className="btn-primary-brand text-xs sm:text-sm"
            >
              <ShieldCheck className="w-4 h-4 text-[#DDEBDD]" /> Partner Verification Console
            </Link>
          )}
        </div>
      </div>

      {error && <ErrorAlert message={error} onRetry={fetchDashboardData} />}

      {/* Partner Verification Gate Warning Banner */}
      {user.role === 'partner' && user.verificationStatus !== 'verified' && (
        <div className="p-5 rounded-2xl border border-amber-300 bg-amber-50 text-amber-950 space-y-2 shadow-2xs">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
            <span>Account Verification Status: {user.verificationStatus.toUpperCase()}</span>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed">
            {user.verificationStatus === 'pending'
              ? 'Your organization documentation is currently awaiting verification by the platform administrator. You can inspect all surplus listings, and recovery request submission unlocks automatically once your verification is approved.'
              : 'Your partner account requires administrative verification before food rescue assignments can be confirmed.'}
          </p>
          <div className="pt-1">
            <Link
              to="/partner/profile"
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-950 underline hover:text-amber-800"
            >
              View Verification Status &amp; Documentation notes →
            </Link>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSpinner message="Fetching dashboard records..." size="lg" />
      ) : (
        <>
          {/* ===================== ORGANIZER / DONOR VIEW ===================== */}
          {user.role === 'organizer' && (
            <div className="space-y-8">
              {/* Quick Donor Guidance Banner */}
              <div className="card-light p-5 sm:p-6 bg-gradient-to-r from-white via-white to-[#F0F4EE] border border-[#E7E8E1] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#DDEBDD] text-[#287653] flex items-center justify-center shrink-0 shadow-2xs">
                    <ChefHat className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#202820] font-serif">
                      Surplus Donation Readiness Checklist
                    </h3>
                    <p className="text-xs text-[#667067] leading-relaxed mt-0.5 max-w-2xl">
                      Cooked buffet meals, sealed boxed meals, and fresh bakery items are eligible.
                      Ensure chafing dishes maintain &gt;65°C or cold desserts stay &lt;5°C until driver handoff.
                    </p>
                  </div>
                </div>
                <Link
                  to="/listings/create"
                  className="btn-primary-brand text-xs py-2 px-4 shrink-0"
                >
                  Create New Batch
                </Link>
              </div>

              {/* Stat Counters */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card-light p-5">
                  <div className="text-xs font-bold text-[#667067] uppercase tracking-wider">
                    My Active Listings
                  </div>
                  <div className="text-3xl font-bold font-serif text-[#202820] mt-2">
                    {myListings.filter((l) => ['open', 'requested'].includes(l.status)).length}
                  </div>
                  <div className="text-[11px] text-[#667067] mt-1">Available for rescue</div>
                </div>

                <div className="card-light p-5">
                  <div className="text-xs font-bold text-[#667067] uppercase tracking-wider">
                    Assigned Pickups
                  </div>
                  <div className="text-3xl font-bold font-serif text-[#287653] mt-2">
                    {myListings.filter((l) => l.status === 'assigned').length}
                  </div>
                  <div className="text-[11px] text-[#667067] mt-1">Partner assigned, awaiting pickup</div>
                </div>

                <div className="card-light p-5">
                  <div className="text-xs font-bold text-[#667067] uppercase tracking-wider">
                    Collected / In Transit
                  </div>
                  <div className="text-3xl font-bold font-serif text-[#D97706] mt-2">
                    {myListings.filter((l) => l.status === 'collected').length}
                  </div>
                  <div className="text-[11px] text-[#667067] mt-1">Hand-off recorded</div>
                </div>

                <div className="card-light p-5">
                  <div className="text-xs font-bold text-[#667067] uppercase tracking-wider">
                    Completed Rescues
                  </div>
                  <div className="text-3xl font-bold font-serif text-[#287653] mt-2">
                    {myListings.filter((l) => l.status === 'delivered').length}
                  </div>
                  <div className="text-[11px] text-[#667067] mt-1">Successfully distributed</div>
                </div>
              </div>

              {/* My Food Listings Table */}
              <div className="card-light overflow-hidden">
                <div className="px-6 py-4 border-b border-[#E7E8E1] flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold font-serif text-[#202820]">
                      My Food Donations
                    </h2>
                    <p className="text-xs text-[#667067]">
                      Review incoming requests from verified partners, track driver arrival, and view rescue status.
                    </p>
                  </div>
                  <Link
                    to="/listings/create"
                    className="text-xs font-bold text-[#287653] hover:underline"
                  >
                    + New Donation
                  </Link>
                </div>

                {myListings.length === 0 ? (
                  <div className="p-8">
                    <EmptyState
                      title="No surplus food listed yet"
                      description="Create your first food donation to allow verified community partners to collect surplus before expiry."
                      actionText="Create Food Donation"
                      actionHref="/listings/create"
                    />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-[#FAF9F6] text-[#667067] font-semibold uppercase text-[10px] tracking-wider border-b border-[#E7E8E1]">
                        <tr>
                          <th className="px-6 py-3">Surplus Food Batch</th>
                          <th className="px-6 py-3">Quantity</th>
                          <th className="px-6 py-3">Safe Window</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E7E8E1] text-[#202820]">
                        {myListings.map((listing) => (
                          <tr key={listing._id} className="hover:bg-[#FAF9F6] transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-bold text-[#202820]">{listing.foodTitle}</div>
                              <div className="text-xs text-[#667067]">
                                Event: {listing.eventName} • {listing.eventType}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-bold text-[#287653]">
                                {listing.quantity} {listing.unit}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <UrgencyBadge deadline={listing.collectionDeadline} />
                            </td>
                            <td className="px-6 py-4">
                              <StatusBadge status={listing.status} />
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Link
                                to={`/listings/${listing._id}`}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#E7E8E1] text-xs font-semibold text-[#202820] hover:bg-[#F0F4EE] transition-colors"
                              >
                                View Requests <ArrowRight className="w-3.5 h-3.5 text-[#287653]" />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================== PARTNER / COORDINATOR / DRIVER VIEW ===================== */}
          {user.role === 'partner' && (
            <div className="space-y-8">
              {/* Stat Counters */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card-light p-5">
                  <div className="text-xs font-bold text-[#667067] uppercase tracking-wider">
                    Available Listings
                  </div>
                  <div className="text-3xl font-bold font-serif text-[#202820] mt-2">
                    {availableListings.length}
                  </div>
                  <div className="text-[11px] text-[#667067] mt-1">Open for rescue</div>
                </div>

                <div className="card-light p-5">
                  <div className="text-xs font-bold text-[#667067] uppercase tracking-wider">
                    My Pending Requests
                  </div>
                  <div className="text-3xl font-bold font-serif text-[#D97706] mt-2">
                    {myRequests.filter((r) => r.status === 'pending').length}
                  </div>
                  <div className="text-[11px] text-[#667067] mt-1">Awaiting organizer review</div>
                </div>

                <div className="card-light p-5">
                  <div className="text-xs font-bold text-[#667067] uppercase tracking-wider">
                    Approved Pickups
                  </div>
                  <div className="text-3xl font-bold font-serif text-[#287653] mt-2">
                    {myRequests.filter((r) => r.status === 'approved').length}
                  </div>
                  <div className="text-[11px] text-[#667067] mt-1">Ready for physical collection</div>
                </div>

                <div className="card-light p-5">
                  <div className="text-xs font-bold text-[#667067] uppercase tracking-wider">
                    Completed Rescues
                  </div>
                  <div className="text-3xl font-bold font-serif text-[#287653] mt-2">
                    {myRequests.filter((r) => r.status === 'delivered').length}
                  </div>
                  <div className="text-[11px] text-[#667067] mt-1">Delivered to beneficiaries</div>
                </div>
              </div>

              {/* Step-by-Step Task Progression Header */}
              <div className="card-light p-5 bg-[#F0F4EE] border-[#E7E8E1]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#287653] block mb-2">
                  Delivery Lifecycle Progression
                </span>
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#202820]">
                  <span className="bg-white px-3 py-1 rounded-xl border border-[#E7E8E1]">1. Assigned</span>
                  <span className="text-[#667067]">→</span>
                  <span className="bg-white px-3 py-1 rounded-xl border border-[#E7E8E1]">2. En Route</span>
                  <span className="text-[#667067]">→</span>
                  <span className="bg-white px-3 py-1 rounded-xl border border-[#E7E8E1]">3. Picked Up</span>
                  <span className="text-[#667067]">→</span>
                  <span className="bg-white px-3 py-1 rounded-xl border border-[#E7E8E1]">4. In Transit</span>
                  <span className="text-[#667067]">→</span>
                  <span className="bg-[#287653] text-white px-3 py-1 rounded-xl">5. Delivered</span>
                </div>
              </div>

              {/* My Active Pickups Section */}
              <div className="card-light overflow-hidden">
                <div className="px-6 py-4 border-b border-[#E7E8E1] flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold font-serif text-[#202820]">
                      My Recovery Requests &amp; Hand-Offs
                    </h2>
                    <p className="text-xs text-[#667067]">
                      Track status history, access pickup instructions, and record collection/delivery.
                    </p>
                  </div>
                  <Link
                    to="/requests"
                    className="text-xs font-bold text-[#287653] hover:underline"
                  >
                    View All Requests →
                  </Link>
                </div>

                {myRequests.length === 0 ? (
                  <div className="p-8">
                    <EmptyState
                      title="No rescue requests submitted yet"
                      description="Browse active event surplus food listings and request suitable donations within your operating capacity."
                      actionText="Browse Surplus Food"
                      actionHref="/listings"
                    />
                  </div>
                ) : (
                  <div className="divide-y divide-[#E7E8E1]">
                    {myRequests.slice(0, 5).map((req) => {
                      const listing = req.listingId as FoodListing;
                      return (
                        <div
                          key={req._id}
                          className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF9F6] transition-colors"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <StatusBadge status={req.status} type="request" size="sm" />
                              <span className="text-xs text-[#667067]">
                                Requested {req.requestedQuantity} {listing?.unit || 'units'}
                              </span>
                            </div>
                            <h3 className="font-bold text-[#202820] text-sm">
                              {listing?.foodTitle || 'Surplus Food'}
                            </h3>
                            <div className="text-xs text-[#667067]">
                              Event: {listing?.eventName} • Locality: {listing?.areaOrAddress}
                            </div>
                            <div className="text-[11px] text-[#667067] italic">
                              &quot;{req.collectionNote}&quot;
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-center">
                            {listing?._id && (
                              <Link
                                to={`/listings/${listing._id}`}
                                className="px-3.5 py-1.5 rounded-xl border border-[#E7E8E1] text-xs font-semibold text-[#202820] hover:bg-[#F0F4EE] transition-colors"
                              >
                                Listing Details
                              </Link>
                            )}
                            <Link
                              to="/requests"
                              className="btn-primary-brand text-xs py-1.5 px-3.5"
                            >
                              Update Status
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================== ADMIN VIEW ===================== */}
          {user.role === 'admin' && (
            <div className="space-y-8">
              {/* Stat Counters */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card-light p-5">
                  <div className="text-xs font-bold text-[#667067] uppercase tracking-wider">
                    Total Platform Listings
                  </div>
                  <div className="text-3xl font-bold font-serif text-[#202820] mt-2">
                    {myListings.length}
                  </div>
                  <div className="text-[11px] text-[#667067] mt-1">Recorded to date</div>
                </div>

                <div className="card-light p-5">
                  <div className="text-xs font-bold text-[#667067] uppercase tracking-wider">
                    Pending Partner Verifications
                  </div>
                  <div className="text-3xl font-bold font-serif text-[#D97706] mt-2">
                    {pendingPartners.length}
                  </div>
                  <div className="text-[11px] text-[#667067] mt-1">Awaiting admin review</div>
                </div>

                <div className="card-light p-5">
                  <div className="text-xs font-bold text-[#667067] uppercase tracking-wider">
                    Meals Rescued
                  </div>
                  <div className="text-3xl font-bold font-serif text-[#287653] mt-2">
                    {impact ? impact.summary?.completedDeliveries || 0 : 0}
                  </div>
                  <div className="text-[11px] text-[#667067] mt-1">Verified hand-offs</div>
                </div>

                <div className="card-light p-5">
                  <div className="text-xs font-bold text-[#667067] uppercase tracking-wider">
                    Verified NGOs
                  </div>
                  <div className="text-3xl font-bold font-serif text-[#287653] mt-2">
                    {impact ? impact.summary?.verifiedPartners || 0 : 0}
                  </div>
                  <div className="text-[11px] text-[#667067] mt-1">Active relief partners</div>
                </div>
              </div>

              {/* Pending Partner Verifications Card */}
              <div className="card-light overflow-hidden">
                <div className="px-6 py-4 border-b border-[#E7E8E1] flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold font-serif text-[#202820]">
                      Pending Partner Verifications
                    </h2>
                    <p className="text-xs text-[#667067]">
                      Review NGO credentials and approve organizations to submit rescue requests.
                    </p>
                  </div>
                  <Link
                    to="/admin/partners"
                    className="text-xs font-bold text-[#287653] hover:underline"
                  >
                    Open Console →
                  </Link>
                </div>

                {pendingPartners.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#667067]">
                    No partners currently pending verification. All applications triaged.
                  </div>
                ) : (
                  <div className="divide-y divide-[#E7E8E1]">
                    {pendingPartners.map((partner) => (
                      <div
                        key={partner.id}
                        className="p-5 flex items-center justify-between gap-4 hover:bg-[#FAF9F6] transition-colors"
                      >
                        <div>
                          <div className="font-bold text-sm text-[#202820]">{partner.name}</div>
                          <div className="text-xs text-[#667067]">
                            Org: {partner.organizationName} • Locality: {partner.partnerServiceArea}
                          </div>
                          <div className="text-xs font-semibold text-[#287653] mt-0.5">
                            Declared Capacity: {partner.partnerCapacity} units
                          </div>
                        </div>

                        <Link
                          to="/admin/partners"
                          className="btn-primary-brand text-xs py-1.5 px-3.5"
                        >
                          Review &amp; Verify
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default DashboardPage;
