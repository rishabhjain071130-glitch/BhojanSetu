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
import { DemoAccountSelector } from '../components/DemoAccountSelector.js';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Demo Fast-Track Bar */}
      <DemoAccountSelector compact />

      {/* Greeting & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {user.role} Dashboard
            </span>
            {user.role === 'partner' && (
              <StatusBadge status={user.verificationStatus} type="verification" size="sm" />
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-gray-950">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            {user.organizationName ? `${user.organizationName} • ` : ''}
            Traceable event surplus food recovery workflow
          </p>
        </div>

        <div className="flex items-center gap-2">
          {user.role === 'organizer' && (
            <Link
              to="/listings/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> Create Food Listing
            </Link>
          )}

          {user.role === 'partner' && (
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm shadow-xs transition-colors"
            >
              <Search className="w-4 h-4" /> Browse Available Food
            </Link>
          )}

          {user.role === 'admin' && (
            <Link
              to="/admin/partners"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-800 hover:bg-purple-900 text-white font-semibold text-sm shadow-xs transition-colors"
            >
              <ShieldCheck className="w-4 h-4" /> Admin Review Console
            </Link>
          )}
        </div>
      </div>

      {error && <ErrorAlert message={error} onRetry={fetchDashboardData} />}

      {/* Partner Verification Gate Warning Banner */}
      {user.role === 'partner' && user.verificationStatus !== 'verified' && (
        <div className="p-4 sm:p-5 rounded-xl border border-amber-300 bg-amber-50 text-amber-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
            <AlertCircle className="w-5 h-5 text-amber-700" />
            <span>Account Verification Status: {user.verificationStatus.toUpperCase()}</span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            {user.verificationStatus === 'pending'
              ? 'Your organization documents are currently under review by the platform administrator. You can view all surplus listings, but submission of food rescue requests unlocks as soon as verification is approved.'
              : 'Your partner account requires administrative verification before food rescue assignments can be confirmed.'}
          </p>
          <div className="pt-1">
            <Link
              to="/partner/profile"
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-950 underline"
            >
              View Verification Status & Documentation notes →
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
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    My Active Listings
                  </div>
                  <div className="text-3xl font-bold text-emerald-800 mt-2">
                    {myListings.filter((l) => ['open', 'requested'].includes(l.status)).length}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">Available for partner rescue</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Assigned Pickups
                  </div>
                  <div className="text-3xl font-bold text-blue-800 mt-2">
                    {myListings.filter((l) => l.status === 'assigned').length}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">Partner assigned, awaiting pickup</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Collected / In Transit
                  </div>
                  <div className="text-3xl font-bold text-indigo-800 mt-2">
                    {myListings.filter((l) => l.status === 'collected').length}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">Hand-off recorded</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Completed Rescues
                  </div>
                  <div className="text-3xl font-bold text-emerald-900 mt-2">
                    {myListings.filter((l) => l.status === 'delivered').length}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">Successfully distributed</div>
                </div>
              </div>

              {/* My Food Listings Table */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">My Surplus Food Listings</h2>
                    <p className="text-xs text-gray-500">
                      Manage listings, view requests, check candidate partner recommendations, and review status.
                    </p>
                  </div>
                  <Link
                    to="/listings/create"
                    className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1"
                  >
                    + New Listing
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
                      <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-[11px] tracking-wider">
                        <tr>
                          <th className="px-6 py-3">Event & Food Title</th>
                          <th className="px-6 py-3">Surplus Volume</th>
                          <th className="px-6 py-3">Collection Deadline</th>
                          <th className="px-6 py-3">Current Status</th>
                          <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {myListings.map((listing) => (
                          <tr key={listing._id} className="hover:bg-gray-50/60 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-semibold text-gray-900">{listing.foodTitle}</div>
                              <div className="text-xs text-gray-500">{listing.eventName}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-semibold text-gray-900">
                                {listing.quantity} {listing.unit}
                              </span>
                              <div className="text-[11px] text-gray-500 capitalize">
                                {listing.foodCategory.replace('_', ' ')}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-xs text-gray-700">
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
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
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
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Available Listings
                  </div>
                  <div className="text-3xl font-bold text-emerald-800 mt-2">
                    {availableListings.length}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">Open for rescue</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    My Pending Requests
                  </div>
                  <div className="text-3xl font-bold text-amber-700 mt-2">
                    {myRequests.filter((r) => r.status === 'pending').length}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">Awaiting organizer review</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Assigned Pickups
                  </div>
                  <div className="text-3xl font-bold text-blue-800 mt-2">
                    {myRequests.filter((r) => r.status === 'approved').length}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">Ready for physical collection</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Completed Rescues
                  </div>
                  <div className="text-3xl font-bold text-emerald-900 mt-2">
                    {myRequests.filter((r) => r.status === 'delivered').length}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">Delivered to beneficiaries</div>
                </div>
              </div>

              {/* My Active Pickups Section */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      My Recovery Requests & Hand-Offs
                    </h2>
                    <p className="text-xs text-gray-500">
                      Track status history, access pickup instructions, and record collection/delivery.
                    </p>
                  </div>
                  <Link
                    to="/requests"
                    className="text-xs font-semibold text-emerald-800 hover:underline"
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
                  <div className="divide-y divide-gray-100">
                    {myRequests.slice(0, 5).map((req) => {
                      const listing = req.listingId as FoodListing;
                      return (
                        <div
                          key={req._id}
                          className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <StatusBadge status={req.status} type="request" size="sm" />
                              <span className="text-xs text-gray-500">
                                Requested {req.requestedQuantity} {listing?.unit || 'units'}
                              </span>
                            </div>
                            <h3 className="font-bold text-gray-900 text-sm">
                              {listing?.foodTitle || 'Surplus Food'}
                            </h3>
                            <div className="text-xs text-gray-500">
                              Event: {listing?.eventName} • Locality: {listing?.areaOrAddress}
                            </div>
                            <div className="text-[11px] text-gray-600 italic">
                              "{req.collectionNote}"
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-center">
                            {listing?._id && (
                              <Link
                                to={`/listings/${listing._id}`}
                                className="px-3.5 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                Listing Details
                              </Link>
                            )}
                            <Link
                              to="/requests"
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 transition-colors"
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
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      Eligible Surplus Food Available For Rescue
                    </h2>
                    <p className="text-xs text-gray-500">
                      Non-expired event listings within open collection windows.
                    </p>
                  </div>
                  <Link
                    to="/listings"
                    className="text-xs font-semibold text-emerald-800 hover:underline"
                  >
                    View All Filtered →
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                  {availableListings.slice(0, 4).map((listing) => (
                    <div
                      key={listing._id}
                      className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-emerald-600 transition-all space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-sm text-gray-900">{listing.foodTitle}</div>
                          <div className="text-xs text-gray-500">{listing.eventName}</div>
                        </div>
                        <UrgencyBadge deadline={listing.collectionDeadline} />
                      </div>

                      <div className="text-xs text-gray-600 line-clamp-2">
                        {listing.description}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 text-xs">
                        <span className="font-semibold text-emerald-900">
                          {listing.quantity} {listing.unit}
                        </span>
                        <Link
                          to={`/listings/${listing._id}`}
                          className="font-semibold text-emerald-800 hover:underline flex items-center gap-1"
                        >
                          View & Request <ArrowRight className="w-3.5 h-3.5" />
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
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Pending Verifications
                  </div>
                  <div className="text-3xl font-bold text-amber-700 mt-2">
                    {pendingPartners.length}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">Partners awaiting review</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Total Platform Listings
                  </div>
                  <div className="text-3xl font-bold text-emerald-800 mt-2">
                    {impact?.summary.totalListings || 0}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">Created in database</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Active Pickups
                  </div>
                  <div className="text-3xl font-bold text-blue-800 mt-2">
                    {(impact?.summary.inProgressPickups || 0) + (impact?.summary.collectedListings || 0)}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">In transit or assigned</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Delivered Rescues
                  </div>
                  <div className="text-3xl font-bold text-emerald-900 mt-2">
                    {impact?.summary.completedDeliveries || 0}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">Successful hand-offs</div>
                </div>
              </div>

              {/* Pending Verifications Quick Table */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      Partner Verifications Pending Review
                    </h2>
                    <p className="text-xs text-gray-500">
                      Review submitted NGO/partner credentials before authorizing food rescue allocations.
                    </p>
                  </div>
                  <Link
                    to="/admin/partners"
                    className="text-xs font-semibold text-purple-800 hover:underline"
                  >
                    Open Admin Console →
                  </Link>
                </div>

                {pendingPartners.length === 0 ? (
                  <div className="p-8 text-center text-xs text-gray-500">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    All registered partner verification submissions have been reviewed!
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {pendingPartners.map((p) => (
                      <div
                        key={p.id}
                        className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="font-bold text-sm text-gray-900">{p.name}</div>
                          <div className="text-xs text-gray-600">
                            Organization: {p.organizationName || 'N/A'} • Email: {p.email} • Capacity:{' '}
                            {p.partnerCapacity || 0} units
                          </div>
                          <div className="text-[11px] text-gray-500 italic">
                            Note: "{p.verificationNote || 'No notes submitted'}"
                          </div>
                        </div>

                        <Link
                          to="/admin/partners"
                          className="px-3.5 py-1.5 rounded-lg bg-purple-800 hover:bg-purple-900 text-white text-xs font-semibold transition-colors shrink-0"
                        >
                          Review & Decide
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
