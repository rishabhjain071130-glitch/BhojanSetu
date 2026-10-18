import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { request } from '../api/client.js';
import {
  FoodListing,
  RecoveryRequest,
  CandidateScore,
} from '../types/index.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { UrgencyBadge } from '../components/UrgencyBadge.js';
import { LoadingSpinner } from '../components/LoadingSpinner.js';
import { ErrorAlert } from '../components/ErrorAlert.js';
import { FoodSafetyBanner } from '../components/FoodSafetyBanner.js';
import {
  Clock,
  MapPin,
  Calendar,
  Building2,
  Utensils,
  ShieldCheck,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Truck,
  HeartHandshake,
  Scale,
  Sparkles,
  Check,
  ArrowRight,
} from 'lucide-react';

export const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [listing, setListing] = useState<FoodListing | null>(null);
  const [requests, setRequests] = useState<RecoveryRequest[]>([]);
  const [candidates, setCandidates] = useState<CandidateScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Partner Request form state
  const [requestedQuantity, setRequestedQuantity] = useState<string>('');
  const [collectionNote, setCollectionNote] = useState<string>('');
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null);

  // Decision state
  const [decisionLoadingId, setDecisionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchListingDetails();
  }, [id, user]);

  const fetchListingDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);

      const listingData = await request<{ listing: FoodListing }>(`/listings/${id}`);
      setListing(listingData.listing);
      setRequestedQuantity(listingData.listing.quantity.toString());

      // If owner or admin, also fetch candidate recommendations and incoming requests
      const isOwner =
        user &&
        ((typeof listingData.listing.ownerId === 'object' &&
          listingData.listing.ownerId?._id === user.id) ||
          listingData.listing.ownerId === user.id);
      const isAdmin = user && user.role === 'admin';

      if (isOwner || isAdmin) {
        const [reqsData, candData] = await Promise.all([
          request<{ requests: RecoveryRequest[] }>(`/listings/${id}/requests`).catch(() => ({
            requests: [],
          })),
          request<{ candidates: CandidateScore[] }>(`/listings/${id}/candidates`).catch(() => ({
            candidates: [],
          })),
        ]);
        setRequests(reqsData.requests || []);
        setCandidates(candData.candidates || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch listing details.');
    } finally {
      setLoading(false);
    }
  };

  const handlePartnerSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;
    try {
      setSubmittingRequest(true);
      setError(null);

      await request(`/listings/${listing._id}/requests`, {
        method: 'POST',
        body: JSON.stringify({
          requestedQuantity: parseFloat(requestedQuantity),
          collectionNote,
        }),
      });

      setRequestSuccess(
        'Rescue request submitted successfully! Awaiting organizer review and assignment.'
      );
      setCollectionNote('');
      fetchListingDetails();
    } catch (err: any) {
      setError(err.message || 'Failed to submit rescue request.');
    } finally {
      setSubmittingRequest(false);
    }
  };

  const handleDecision = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      setDecisionLoadingId(requestId);
      setError(null);

      await request(`/requests/${requestId}/decision`, {
        method: 'PATCH',
        body: JSON.stringify({
          status,
          reason:
            status === 'approved'
              ? 'Approved by listing organizer coordinator'
              : 'Declined by organizer',
        }),
      });

      fetchListingDetails();
    } catch (err: any) {
      setError(err.message || 'Failed to record decision.');
    } finally {
      setDecisionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <LoadingSpinner message="Retrieving surplus batch details and verification state..." size="lg" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorAlert message="Surplus listing not found." />
      </div>
    );
  }

  const isOwner =
    user &&
    ((typeof listing.ownerId === 'object' && listing.ownerId?._id === user.id) ||
      listing.ownerId === user.id);
  const isAdmin = user && user.role === 'admin';
  const isAssignedPartner =
    user &&
    ((typeof listing.assignedPartnerId === 'object' &&
      listing.assignedPartnerId?._id === user.id) ||
      listing.assignedPartnerId === user.id);

  const remainingQuantity = Math.max(0, listing.quantity - (listing.allocatedQuantity || 0));
  const isExpired = listing.isExpired || new Date(listing.collectionDeadline).getTime() <= Date.now();
  const canRequest =
    user?.role === 'partner' &&
    user?.verificationStatus === 'verified' &&
    !isExpired &&
    remainingQuantity > 0 &&
    ['open', 'requested'].includes(listing.status);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Breadcrumb navigation */}
      <div className="flex items-center gap-2 text-xs text-[#68736A]">
        <Link to="/listings" className="hover:text-[#174D3A] transition-colors">
          Surplus Discovery
        </Link>
        <span>/</span>
        <span className="text-[#202820] font-semibold truncate">{listing.foodTitle}</span>
      </div>

      {error && <ErrorAlert message={error} />}
      {requestSuccess && (
        <div className="p-4 rounded-2xl bg-[#DDE8D8]/50 border border-[#174D3A]/30 text-[#174D3A] text-xs sm:text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#237653] shrink-0" />
          {requestSuccess}
        </div>
      )}

      {/* Main Listing Header & Status */}
      <div className="card-editorial p-6 sm:p-9 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-stone-100">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#174D3A] bg-[#DDE8D8]/70 px-2.5 py-0.5 rounded-full border border-[#174D3A]/10">
                {listing.eventType} event
              </span>
              <StatusBadge status={listing.status} />
              <UrgencyBadge deadline={listing.collectionDeadline} />
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#202820]">
              {listing.foodTitle}
            </h1>

            <p className="text-xs sm:text-sm text-[#68736A] flex items-center gap-1.5 font-medium">
              <Building2 className="w-4 h-4 text-[#174D3A]" />
              Event: <strong className="text-[#202820]">{listing.eventName}</strong>
              {typeof listing.ownerId === 'object' && listing.ownerId?.name && (
                <span className="text-[#68736A]"> • Listed by {listing.ownerId.name}</span>
              )}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#DDE8D8]/40 border border-[#174D3A]/15 text-right sm:min-w-[170px]">
            <span className="text-[11px] uppercase tracking-wider text-[#68736A] font-bold block">
              Surplus Volume
            </span>
            <div className="text-3xl font-bold font-serif text-[#174D3A] mt-0.5">
              {listing.quantity} <span className="text-sm font-semibold font-sans">{listing.unit}</span>
            </div>
            {listing.allocatedQuantity > 0 && (
              <span className="text-[11px] text-blue-900 font-semibold block mt-1">
                {listing.allocatedQuantity} {listing.unit} Allocated
              </span>
            )}
          </div>
        </div>

        {/* Core Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
            <span className="text-xs text-[#68736A] font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#174D3A]" /> Prepared Time
            </span>
            <div className="font-semibold text-[#202820] text-xs sm:text-sm">
              {new Date(listing.preparedAt).toLocaleString([], {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
            <span className="text-xs text-[#68736A] font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#E7A85B]" /> Collection Deadline
            </span>
            <div className="font-semibold text-[#202820] text-xs sm:text-sm">
              {new Date(listing.collectionDeadline).toLocaleString([], {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
            <span className="text-xs text-[#68736A] font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#174D3A]" /> General Area
            </span>
            <div className="font-semibold text-[#202820] text-xs sm:text-sm">
              {listing.areaOrAddress}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
            <span className="text-xs text-[#68736A] font-medium flex items-center gap-1">
              <Utensils className="w-3.5 h-3.5 text-[#174D3A]" /> Category
            </span>
            <div className="font-semibold text-[#202820] text-xs sm:text-sm capitalize">
              {listing.foodCategory.replace('_', ' ')}
            </div>
          </div>
        </div>

        {/* Detailed description and handling */}
        <div className="space-y-4 pt-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#68736A] mb-1.5">
              Description &amp; Preparation State
            </h3>
            <p className="text-sm text-[#202820] leading-relaxed bg-stone-50/60 p-4 rounded-xl border border-stone-200/60">
              {listing.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#68736A] mb-1.5">
                Thermal Storage &amp; Handling Conditions
              </h3>
              <p className="text-xs sm:text-sm text-[#174D3A] font-medium bg-[#DDE8D8]/40 p-3 rounded-xl border border-[#174D3A]/15">
                {listing.storageConditions}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#68736A] mb-1.5">
                Allergen / Dietary Information
              </h3>
              <p className="text-xs sm:text-sm text-[#202820] bg-stone-50 p-3 rounded-xl border border-stone-200/60">
                {listing.allergenNotes || 'No specific allergen restrictions reported by organizer.'}
              </p>
            </div>
          </div>
        </div>

        {/* Private Pickup Hand-Off Box (Privacy Gate Protected) */}
        <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50/80 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#202820]">
              {isOwner || isAdmin || isAssignedPartner ? (
                <>
                  <Unlock className="w-4 h-4 text-[#237653]" /> Private Pickup Hand-Off Details (Authorized)
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#E7A85B]" /> Private Pickup Hand-Off Details (Locked)
                </>
              )}
            </div>
            {isAssignedPartner && (
              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#DDE8D8] text-[#174D3A]">
                Assigned Partner Clearance
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-[#202820] font-medium">
            {listing.pickupInstructions}
          </p>
        </div>

        <FoodSafetyBanner compact />
      </div>

      {/* ===================== SMART RESCUE ENGINE: RULE-BASED MATCHING ===================== */}
      {(isOwner || isAdmin) && (
        <div className="card-editorial p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#174D3A]" />
                <h2 className="text-lg font-bold text-[#202820] font-serif">
                  BhojanSetu Smart Rescue Engine (Rule-Based, Non-ML)
                </h2>
              </div>
              <p className="text-xs text-[#68736A] mt-0.5">
                Transparent ranking of candidate recovery partners based on verification, capacity fit, deadline urgency, and service area.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-[#174D3A] bg-[#DDE8D8]/70 px-2.5 py-1 rounded-full border border-[#174D3A]/10 self-start sm:self-auto">
              Deterministic Algorithm
            </span>
          </div>

          {candidates.length === 0 ? (
            <div className="text-xs text-[#68736A] p-4 text-center">
              No registered partners found in database.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {candidates.map((cand) => (
                <div
                  key={cand.partnerId}
                  className={`p-4 rounded-2xl border space-y-2.5 transition-all ${
                    cand.eligible
                      ? 'border-[#174D3A]/20 bg-[#DDE8D8]/30'
                      : 'border-stone-200 bg-stone-50 opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-[#202820]">
                        {cand.organizationName || cand.partnerName}
                      </div>
                      <div className="text-[11px] text-[#68736A]">{cand.serviceArea}</div>
                    </div>
                    {cand.eligible ? (
                      <span className="text-xs font-bold text-[#174D3A] bg-[#DDE8D8] px-2 py-0.5 rounded-full">
                        Score: {cand.score}/100
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                        Ineligible
                      </span>
                    )}
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="text-[#68736A]">
                      Capacity: <strong className="text-[#202820]">{cand.capacity} units</strong>
                    </div>
                    <ul className="text-[11px] text-[#68736A] space-y-0.5">
                      {cand.reasons.map((r, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <Check className="w-3 h-3 text-[#237653] shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===================== INCOMING REQUESTS REVIEW (OWNER/ADMIN) ===================== */}
      {(isOwner || isAdmin) && (
        <div className="card-editorial overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100">
            <h2 className="text-base font-bold font-serif text-[#202820]">
              Partner Recovery Requests ({requests.length})
            </h2>
            <p className="text-xs text-[#68736A]">
              Review requests submitted by verified partners. Approving an assignment reserves the surplus volume.
            </p>
          </div>

          {requests.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#68736A]">
              No rescue requests submitted for this listing yet.
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {requests.map((req) => {
                const partnerObj = typeof req.partnerId === 'object' ? req.partnerId : null;
                const isPending = req.status === 'pending';
                const isApproved = req.status === 'approved';

                return (
                  <div
                    key={req._id}
                    className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/70 transition-colors"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={req.status} type="request" size="sm" />
                        <span className="text-xs font-bold text-[#202820]">
                          {partnerObj?.organizationName || partnerObj?.name || 'Recovery Partner'}
                        </span>
                        {partnerObj?.verificationStatus === 'verified' && (
                          <span className="text-[10px] bg-[#DDE8D8] text-[#174D3A] px-2 py-0.5 rounded-full font-bold">
                            Verified NGO
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-[#68736A]">
                        Requested Quantity:{' '}
                        <strong className="text-[#202820]">
                          {req.requestedQuantity} {listing.unit}
                        </strong>{' '}
                        • Capacity: {partnerObj?.partnerCapacity || 'N/A'} units
                      </div>

                      <p className="text-xs text-[#202820] bg-stone-50 p-3 rounded-xl border border-stone-200/80">
                        Collection note: "{req.collectionNote}"
                      </p>

                      <div className="text-[10px] text-[#68736A]">
                        Submitted:{' '}
                        {new Date(req.createdAt).toLocaleString([], {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </div>
                    </div>

                    {isPending && (
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          type="button"
                          disabled={decisionLoadingId === req._id}
                          onClick={() => handleDecision(req._id, 'approved')}
                          className="px-4 py-2 rounded-xl bg-[#174D3A] hover:bg-[#237653] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#E7A85B]" /> Approve &amp; Assign
                        </button>
                        <button
                          type="button"
                          disabled={decisionLoadingId === req._id}
                          onClick={() => handleDecision(req._id, 'rejected')}
                          className="px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-[#68736A] hover:bg-stone-100 transition-colors disabled:opacity-50"
                        >
                          Decline
                        </button>
                      </div>
                    )}

                    {isApproved && (
                      <div className="text-xs font-semibold text-blue-900 flex items-center gap-1.5 self-end sm:self-center">
                        <CheckCircle2 className="w-4 h-4 text-blue-700" /> Assigned to this Partner
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ===================== PARTNER REQUEST FORM CARD ===================== */}
      {user?.role === 'partner' && (
        <div className="card-editorial p-6 sm:p-8 space-y-5">
          <div className="pb-3 border-b border-stone-100">
            <h2 className="text-base font-bold font-serif text-[#202820] flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-[#174D3A]" />
              Claim / Request This Surplus Food
            </h2>
            <p className="text-xs text-[#68736A] mt-0.5">
              Available capacity on this listing: <strong>{remainingQuantity} {listing.unit}</strong>
            </p>
          </div>

          {!canRequest ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-[#68736A] space-y-1">
              <div className="font-bold text-[#202820] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Rescue Request Disabled
              </div>
              <p>
                {user.verificationStatus !== 'verified'
                  ? 'Your partner account is pending admin verification. Verification is required before claiming food rescue assignments.'
                  : isExpired
                  ? 'The collection deadline for this listing has expired.'
                  : listing.status !== 'open' && listing.status !== 'requested'
                  ? `This listing is currently in '${listing.status}' status and no longer open for requests.`
                  : 'Listing currently not accepting new requests.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handlePartnerSubmitRequest} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#202820] uppercase tracking-wider mb-1.5">
                    Requested Quantity ({listing.unit}) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={Math.min(remainingQuantity, user.partnerCapacity || remainingQuantity)}
                    value={requestedQuantity}
                    onChange={(e) => setRequestedQuantity(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-xs sm:text-sm bg-stone-50/50 focus:bg-white focus:ring-2 focus:ring-[#174D3A] focus:outline-none transition-all"
                  />
                  <span className="text-[10px] text-[#68736A] mt-1 block">
                    Bounded by available surplus and your registered capacity ({user.partnerCapacity || 0} units).
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#202820] uppercase tracking-wider mb-1.5">
                    Pickup Timeline &amp; Volunteer Note *
                  </label>
                  <input
                    type="text"
                    required
                    value={collectionNote}
                    onChange={(e) => setCollectionNote(e.target.value)}
                    placeholder="e.g. Dispatched insulated van with 2 volunteers. ETA 35 minutes."
                    className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-xs sm:text-sm bg-stone-50/50 focus:bg-white focus:ring-2 focus:ring-[#174D3A] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submittingRequest}
                  className="px-6 py-2.5 rounded-xl bg-[#174D3A] hover:bg-[#237653] text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {submittingRequest ? (
                    'Submitting Request...'
                  ) : (
                    <>
                      <HeartHandshake className="w-4 h-4 text-[#E7A85B]" /> Submit Rescue Request
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
