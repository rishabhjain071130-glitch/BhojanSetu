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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Greeting & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#174D3A]/15">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#174D3A] bg-[#DDE8D8]/70 px-2.5 py-0.5 rounded-full border border-[#174D3A]/10">
              {user.role} Workspace
            </span>
            {user.role === 'partner' && (
              <StatusBadge status={user.verificationStatus} type="verification" size="sm" />
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#202820] tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#68736A] mt-0.5">
            {user.organizationName ? `${user.organizationName} • ` : ''}
            Verified event-based surplus food recovery pipeline
          </p>
        </div>

        <div className="flex items-center gap-3">
          {user.role === 'organizer' && (
            <Link
              to="/listings/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#174D3A] hover:bg-[#237653] text-white font-semibold text-xs sm:text-sm shadow-xs transition-all hover:scale-[1.01]"
            >
              <PlusCircle className="w-4 h-4 text-[#E7A85B]" /> Donate Surplus Food
            </Link>
          )}

          {user.role === 'partner' && (
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#174D3A] hover:bg-[#237653] text-white font-semibold text-xs sm:text-sm shadow-xs transition-all hover:scale-[1.01]"
            >
              <Search className="w-4 h-4 text-[#E7A85B]" /> Discover Available Food
            </Link>
          )}

          {user.role === 'admin' && (
            <Link
              to="/admin/partners"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#174D3A] hover:bg-[#237653] text-white font-semibold text-xs sm:text-sm shadow-xs transition-all hover:scale-[1.01]"
            >
              <ShieldCheck className="w-4 h-4 text-[#E7A85B]" /> Partner Verification Console
            </Link>
          )}
        </div>
      </div>

      {error && <ErrorAlert message={error} onRetry={fetchDashboardData} />}

      {/* Partner Verification Gate Warning Banner */}
      {user.role === 'partner' && user.verificationStatus !== 'verified' && (
        <div className="p-5 rounded-2xl border border-amber-300 bg-amber-50/80 text-amber-950 space-y-2 shadow-xs">
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
        <LoadingSpinner message="Fetching live persistent dashboard metrics..." size="lg" />
      ) : (
        <>
          {/* ===================== ORGANIZER VIEW ===================== */}
          {user.role === 'organizer' && (
            <div className="space-y-8">
              {/* Stat Counters */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card-editorial p-5">
                  <div className="text-xs font-bold text-[#68736A] uppercase tracking-wider">
                    My Active Listings
                  </div>
                  <div className="text-3xl font-bold font-serif text-[#174D3A] mt-2">
                    {myListings.filter((l) => ['open', 'requested'].includes(l.status)).length}
                  </div>
                  <div className="text-[11px] text-[#68736A] mt-1">Available for rescue</div>
                </div>

                <div className="card-editorial p-5">
                  <div className="text-xs font-bold text-[#68736A] uppercase tracking-wider">
                    Assigned Pickups
                  </div>
                  <div className="text-3xl font-bold font-serif text-blue-900 mt-2">
                    {myListings.filter((l) => l.status === 'assigned').length}
                  </div>
                  <div className="text-[11px] text-[#68736A] mt-1">Partner assigned, awaiting pickup</div>
                </div>

                <div className="card-editorial p-5">
                  <div className="text-xs font-bold text-[#68736A] uppercase tracking-wider">
                    Collected / In Transit
                  </div>
                  <div className="text-3xl font-bold font-serif text-amber-900 mt-2">
                    {myListings.filter((l) => l.status === 'collected').length}
                  </div>
                  <div className="text-[11px] text-[#68736A] mt-1">Hand-off recorded</div>
                </div>

                <div className="card-editorial p-5">
                  <div className="text-xs font-bold text-[#68736A] uppercase tracking-wider">
                    Completed Rescues
                  </div>
                  <div className="text-3xl font-bold font-serif text-[#174D3A] mt-2">
                    {myListings.filter((l) => l.status === 'delivered').length}
                  </div>
                  <div className="text-[11px] text-[#68736A] mt-1">Successfully distributed</div>
                </div>
              </div>

              {/* My Food Listings Table */}
              <div className="card-editorial overflow-hidden">
                <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold font-serif text-[#202820]">
                      My Surplus Food Listings
                    </h2>
                    <p className="text-xs text-[#68736A]">
                      Manage listings, review requests, inspect candidate partner recommendations, and track status.
                    </p>
                  </div>
                  <Link
                    to="/listings/create"
                    className="text-xs font-semibold text-[#174D3A] hover:underline flex items-center gap-1"
                  >
                    + Donate Surplus
                  </Link>
                </div>

                {myListings.length === 0 ? (
                  <div className="p-8">
                    <EmptyState
                      title="No listings created yet"
                      description="Create your first surplus food listing to coordinate rescue with verified partners."
                      actionText="Create Listing Now"
                      actionHref="/listings/create"
                    />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-stone-50 border-b border-stone-200/80 text-[#68736A] uppercase text-[11px] tracking-wider">
                        <tr>
                          <th className="px-6 py-3.5 font-bold">Event &amp; Food Title</th>
                          <th className="px-6 py-3.5 font-bold">Surplus Volume</th>
                          <th className="px-6 py-3.5 font-bold">Collection Deadline</th>
                          <th className="px-6 py-3.5 font-bold">Current Status</th>
                          <th className="px-6 py-3.5 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {myListings.map((listing) => (
                          <tr key={listing._id} className="hover:bg-stone-50/70 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-bold text-[#202820]">{listing.foodTitle}</div>
                              <div className="text-xs text-[#68736A]">{listing.eventName}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-bold text-[#174D3A]">
                                {listing.quantity} {listing.unit}
                              </span>
                              <div className="text-[11px] text-[#68736A] capitalize">
                                {listing.foodCategory.replace('_', ' ')}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-xs text-[#202820] font-medium">
                                {new Date(listing.collectionDeadline).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                              <UrgencyBadge deadline={listing.collectionDeadline} />
                            </td>
                            <td className="px-6 py-4">
                              <StatusBadge status={listing.status} />
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Link
                                to={`/listings/${listing._id}`}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-[#174D3A] hover:bg-stone-100 transition-colors"
                              >
                                View / Manage Requests <ArrowRight className="w-3.5 h-3.5" />
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

          {/* ===================== PARTNER VIEW ===================== */}
          {user.role === 'partner' && (
            <div className="space-y-8">
              {/* Stat Counters */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card-editorial p-5">
                  <div className="text-xs font-bold text-[#68736A] uppercase tracking-wider">
                    Available Listings
                  </div>
                  <div className="text-3xl font-bold font-serif text-[#174D3A] mt-2">
                    {availableListings.length}
                  </div>
                  <div className="text-[11px] text-[#68736A] mt-1">Open for rescue</div>
                </div>

                <div className="card-editorial p-5">
                  <div className="text-xs font-bold text-[#68736A] uppercase tracking-wider">
                    My Pending Requests
                  </div>
                  <div className="text-3xl font-bold font-serif text-amber-800 mt-2">
                    {myRequests.filter((r) => r.status === 'pending').length}
                  </div>
                  <div className="text-[11px] text-[#68736A] mt-1">Awaiting organizer review</div>
                </div>

                <div className="card-editorial p-5">
                  <div className="text-xs font-bold text-[#68736A] uppercase tracking-wider">
                    Assigned Pickups
                  </div>
                  <div className="text-3xl font-bold font-serif text-blue-900 mt-2">
                    {myRequests.filter((r) => r.status === 'approved').length}
                  </div>
                  <div className="text-[11px] text-[#68736A] mt-1">Ready for physical collection</div>
                </div>

                <div className="card-editorial p-5">
                  <div className="text-xs font-bold text-[#68736A] uppercase tracking-wider">
                    Completed Rescues
                  </div>
                  <div className="text-3xl font-bold font-serif text-[#174D3A] mt-2">
                    {myRequests.filter((r) => r.status === 'delivered').length}
                  </div>
                  <div className="text-[11px] text-[#68736A] mt-1">Delivered to beneficiaries</div>
                </div>
              </div>

              {/* My Active Pickups Section */}
              <div className="card-editorial overflow-hidden">
                <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold font-serif text-[#202820]">
                      My Recovery Requests &amp; Hand-Offs
                    </h2>
                    <p className="text-xs text-[#68736A]">
                      Track status history, access pickup instructions, and record collection/delivery.
                    </p>
                  </div>
                  <Link
                    to="/requests"
                    className="text-xs font-semibold text-[#174D3A] hover:underline"
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
                  <div className="divide-y divide-stone-100">
                    {myRequests.slice(0, 5).map((req) => {
                      const listing = req.listingId as FoodListing;
                      return (
                        <div
                          key={req._id}
                          className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50 transition-colors"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <StatusBadge status={req.status} type="request" size="sm" />
                              <span className="text-xs text-[#68736A]">
                                Requested {req.requestedQuantity} {listing?.unit || 'units'}
                              </span>
                            </div>
                            <h3 className="font-bold text-[#202820] text-sm">
                              {listing?.foodTitle || 'Surplus Food'}
                            </h3>
                            <div className="text-xs text-[#68736A]">
                              Event: {listing?.eventName} • Locality: {listing?.areaOrAddress}
                            </div>
                            <div className="text-[11px] text-[#68736A] italic">
                              "{req.collectionNote}"
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-center">
                            {listing?._id && (
                              <Link
                                to={`/listings/${listing._id}`}
                                className="px-3.5 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-[#202820] hover:bg-stone-100 transition-colors"
                              >
                                Listing Details
                              </Link>
                            )}
                            <Link
                              to="/requests"
                              className="px-4 py-1.5 rounded-xl bg-[#174D3A] text-white text-xs font-semibold hover:bg-[#237653] transition-colors shadow-xs"
                            >
                              Manage Hand-Off
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Available Surplus Listings Preview */}
              <div className="card-editorial overflow-hidden">
                <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold font-serif text-[#202820]">
                      Eligible Surplus Food Available For Rescue
                    </h2>
                    <p className="text-xs text-[#68736A]">
                      Non-expired event listings within open collection windows.
                    </p>
                  </div>
                  <Link
                    to="/listings"
                    className="text-xs font-semibold text-[#174D3A] hover:underline"
                  >
                    View All Filtered →
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                  {availableListings.slice(0, 4).map((listing) => (
                    <div
                      key={listing._id}
                      className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-[#174D3A] transition-all space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-sm text-[#202820]">{listing.foodTitle}</div>
                          <div className="text-xs text-[#68736A]">{listing.eventName}</div>
                        </div>
                        <UrgencyBadge deadline={listing.collectionDeadline} />
                      </div>

                      <div className="text-xs text-[#68736A] line-clamp-2">
                        {listing.description}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 text-xs">
                        <span className="font-bold text-[#174D3A]">
                          {listing.quantity} {listing.unit}
                        </span>
                        <Link
                          to={`/listings/${listing._id}`}
                          className="font-semibold text-[#174D3A] hover:underline flex items-center gap-1"
                        >
                          View &amp; Request <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================== ADMIN VIEW ===================== */}
          {user.role === 'admin' && (
            <div className="space-y-8">
              {/* Stat Counters */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card-editorial p-5">
                  <div className="text-xs font-bold text-[#68736A] uppercase tracking-wider">
                    Pending Verifications
                  </div>
                  <div className="text-3xl font-bold font-serif text-amber-800 mt-2">
                    {pendingPartners.length}
                  </div>
                  <div className="text-[11px] text-[#68736A] mt-1">Partners awaiting review</div>
                </div>

                <div className="card-editorial p-5">
                  <div className="text-xs font-bold text-[#68736A] uppercase tracking-wider">
                    Total Platform Listings
                  </div>
                  <div className="text-3xl font-bold font-serif text-[#174D3A] mt-2">
                    {impact?.summary.totalListings || 0}
                  </div>
                  <div className="text-[11px] text-[#68736A] mt-1">Created in database</div>
                </div>

                <div className="card-editorial p-5">
                  <div className="text-xs font-bold text-[#68736A] uppercase tracking-wider">
                    Active Pickups
                  </div>
                  <div className="text-3xl font-bold font-serif text-blue-900 mt-2">
                    {(impact?.summary.inProgressPickups || 0) + (impact?.summary.collectedListings || 0)}
                  </div>
                  <div className="text-[11px] text-[#68736A] mt-1">In transit or assigned</div>
                </div>

                <div className="card-editorial p-5">
                  <div className="text-xs font-bold text-[#68736A] uppercase tracking-wider">
                    Delivered Rescues
                  </div>
                  <div className="text-3xl font-bold font-serif text-[#174D3A] mt-2">
                    {impact?.summary.completedDeliveries || 0}
                  </div>
                  <div className="text-[11px] text-[#68736A] mt-1">Successful hand-offs</div>
                </div>
              </div>

              {/* Pending Verifications Quick Table */}
              <div className="card-editorial overflow-hidden">
                <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold font-serif text-[#202820]">
                      Partner Verifications Pending Review
                    </h2>
                    <p className="text-xs text-[#68736A]">
                      Review submitted NGO/partner credentials before authorizing food rescue allocations.
                    </p>
                  </div>
                  <Link
                    to="/admin/partners"
                    className="text-xs font-semibold text-[#174D3A] hover:underline"
                  >
                    Open Admin Console →
                  </Link>
                </div>

                {pendingPartners.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#68736A]">
                    <CheckCircle2 className="w-8 h-8 text-[#237653] mx-auto mb-2" />
                    All registered partner verification submissions have been reviewed!
                  </div>
                ) : (
                  <div className="divide-y divide-stone-100">
                    {pendingPartners.map((p) => (
                      <div
                        key={p.id}
                        className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="font-bold text-sm text-[#202820]">{p.name}</div>
                          <div className="text-xs text-[#68736A]">
                            Organization: {p.organizationName || 'N/A'} • Email: {p.email} • Capacity:{' '}
                            {p.partnerCapacity || 0} units
                          </div>
                          <div className="text-[11px] text-[#68736A] italic">
                            Note: "{p.verificationNote || 'No notes submitted'}"
                          </div>
                        </div>

                        <Link
                          to="/admin/partners"
                          className="px-4 py-2 rounded-xl bg-[#174D3A] hover:bg-[#237653] text-white text-xs font-semibold transition-colors shrink-0 shadow-xs"
                        >
                          Review &amp; Decide
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Persistent Food Safety Reminder in Dashboards */}
          <FoodSafetyBanner compact />
        </>
      )}
    </div>
  );
};
