import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { request } from '../api/client.js';
import { RecoveryRequest, FoodListing } from '../types/index.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { LoadingSpinner } from '../components/LoadingSpinner.js';
import { EmptyState } from '../components/EmptyState.js';
import { ErrorAlert } from '../components/ErrorAlert.js';
import { FoodSafetyBanner } from '../components/FoodSafetyBanner.js';
import {
  ClipboardList,
  Truck,
  PackageCheck,
  Clock,
  CheckCircle2,
  Lock,
  Unlock,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  History,
  X,
} from 'lucide-react';

export const RequestsPage: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<RecoveryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Transition modal/action state
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [statusReason, setStatusReason] = useState<string>('');
  const [selectedReqForModal, setSelectedReqForModal] = useState<RecoveryRequest | null>(null);
  const [targetStatus, setTargetStatus] = useState<'collected' | 'delivered' | null>(null);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await request<{ requests: RecoveryRequest[] }>('/requests/mine');
      setRequests(data.requests || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch recovery requests.');
    } finally {
      setLoading(false);
    }
  };

  const openStatusModal = (req: RecoveryRequest, nextStatus: 'collected' | 'delivered') => {
    setSelectedReqForModal(req);
    setTargetStatus(nextStatus);
    setStatusReason(
      nextStatus === 'collected'
        ? 'Inspected food temperature and loaded into temperature-controlled vehicle'
        : 'Delivered and served directly to community kitchen beneficiaries'
    );
  };

  const handleConfirmStatusUpdate = async () => {
    if (!selectedReqForModal || !targetStatus) return;
    try {
      setActionLoadingId(selectedReqForModal._id);
      setError(null);

      await request(`/requests/${selectedReqForModal._id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: targetStatus,
          reason: statusReason,
        }),
      });

      setSelectedReqForModal(null);
      setTargetStatus(null);
      fetchMyRequests();
    } catch (err: any) {
      setError(err.message || 'Failed to update request status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E8E1]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#287653]">
            <span className="w-2 h-2 rounded-full bg-[#287653]" />
            Recovery Operations
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#202820] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0F4EE] text-[#287653] flex items-center justify-center shrink-0 border border-[#E7E8E1]">
              <ClipboardList className="w-5 h-5 text-[#287653]" />
            </div>
            My Pickups &amp; Hand-Off Timeline
          </h1>
          <p className="text-xs sm:text-sm text-[#667067]">
            Track status progression with an immutable audit history from organizer approval to final distribution.
          </p>
        </div>

        <Link
          to="/listings"
          className="btn-primary-brand text-xs sm:text-sm self-start sm:self-auto"
        >
          Discover More Surplus Food
        </Link>
      </div>

      <FoodSafetyBanner compact />

      {error && <ErrorAlert message={error} onRetry={fetchMyRequests} />}

      {loading ? (
        <LoadingSpinner message="Loading your recovery requests and hand-off timeline..." size="lg" />
      ) : requests.length === 0 ? (
        <EmptyState
          title="No recovery requests yet"
          description="Browse open event surplus food listings and submit requests to coordinate rescue hand-offs."
          actionText="Browse Available Surplus"
          actionHref="/listings"
        />
      ) : (
        <div className="space-y-6">
          {requests.map((req) => {
            const listing = req.listingId as FoodListing;
            const canCollect = req.status === 'approved';
            const canDeliver = req.status === 'collected';

            return (
              <div
                key={req._id}
                className="card-light p-6 sm:p-7 space-y-5 bg-white border border-[#E7E8E1]"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-[#E7E8E1]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={req.status} type="request" />
                      <span className="text-xs text-[#667067] font-mono">
                        Ref: {req._id.slice(-6)}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold font-serif text-[#202820]">
                      {listing?.foodTitle || 'Surplus Food Batch'}
                    </h2>

                    <div className="text-xs text-[#667067]">
                      Event: <strong className="text-[#202820]">{listing?.eventName}</strong> • Area:{' '}
                      <strong className="text-[#202820]">{listing?.areaOrAddress}</strong>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1 text-right">
                    <span className="text-xs text-[#667067] font-medium">Requested Surplus</span>
                    <div className="text-2xl font-bold font-serif text-[#202820]">
                      {req.requestedQuantity}{' '}
                      <span className="text-xs font-semibold">{listing?.unit || 'units'}</span>
                    </div>
                  </div>
                </div>

                {/* Private Pickup Hand-Off Details (Unlocked once approved) */}
                <div className="p-4 rounded-xl bg-[#F0F4EE] border border-[#E7E8E1] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#202820]">
                    {req.status === 'approved' ||
                    req.status === 'collected' ||
                    req.status === 'delivered' ? (
                      <>
                        <Unlock className="w-3.5 h-3.5 text-[#287653]" /> Private Pickup Instructions
                        (Unlocked)
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-[#E9AE62]" /> Private Pickup Instructions
                        (Locked until approval)
                      </>
                    )}
                  </div>
                  <p className="text-xs text-[#202820] font-medium">
                    {listing?.pickupInstructions ||
                      'Pickup instructions will unlock upon verified organizer approval.'}
                  </p>
                </div>

                {/* Action Buttons for Hand-Off transitions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E7E8E1]">
                  <div className="text-xs text-[#667067]">
                    My collection note: <span className="text-[#202820] italic font-medium">&quot;{req.collectionNote}&quot;</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {canCollect && (
                      <button
                        type="button"
                        onClick={() => openStatusModal(req, 'collected')}
                        className="btn-primary-brand text-xs py-2 px-4 shadow-2xs"
                      >
                        <Truck className="w-4 h-4 text-white" /> Record Collection (Loaded)
                      </button>
                    )}

                    {canDeliver && (
                      <button
                        type="button"
                        onClick={() => openStatusModal(req, 'delivered')}
                        className="btn-primary-brand text-xs py-2 px-4 shadow-2xs"
                      >
                        <PackageCheck className="w-4 h-4 text-white" /> Record Delivery (Completed)
                      </button>
                    )}

                    {listing?._id && (
                      <Link
                        to={`/listings/${listing._id}`}
                        className="btn-outline text-xs py-2 px-3.5"
                      >
                        Listing Details
                      </Link>
                    )}
                  </div>
                </div>

                {/* Audit Trail Timeline */}
                {req.statusHistory && req.statusHistory.length > 0 && (
                  <div className="pt-3 border-t border-[#E7E8E1]">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#287653] uppercase tracking-wider mb-3">
                      <History className="w-3.5 h-3.5 text-[#287653]" /> Immutable Status Audit Trail
                    </div>

                    <div className="space-y-2">
                      {req.statusHistory.map((entry, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 text-xs bg-[#FAF9F6] p-2.5 rounded-xl border border-[#E7E8E1]"
                        >
                          <span className="w-2 h-2 rounded-full bg-[#287653] mt-1.5 shrink-0" />
                          <div className="space-y-0.5 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#202820] uppercase tracking-wider text-[10px]">
                                {entry.previousStatus ? `${entry.previousStatus} → ${entry.newStatus}` : entry.newStatus}
                                {entry.actorName ? ` • ${entry.actorName}` : ''}
                              </span>
                              <span className="text-[10px] text-[#667067]">
                                {new Date(entry.timestamp).toLocaleString([], {
                                  dateStyle: 'medium',
                                  timeStyle: 'short',
                                })}
                              </span>
                            </div>
                            {entry.reason && (
                              <p className="text-[11px] text-[#667067] italic">&quot;{entry.reason}&quot;</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Transition Confirmation Modal */}
      {selectedReqForModal && targetStatus && (
        <div
          role="dialog"
          aria-label="Confirm Status Update"
          className="fixed inset-0 z-50 bg-[#202820]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="card-light p-6 sm:p-7 max-w-lg w-full space-y-5 animate-slide-up shadow-xl bg-white border border-[#E7E8E1]">
            <div className="flex items-start justify-between pb-3 border-b border-[#E7E8E1]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#DDEBDD] text-[#287653] flex items-center justify-center">
                  {targetStatus === 'collected' ? (
                    <Truck className="w-4 h-4 text-[#287653]" />
                  ) : (
                    <PackageCheck className="w-4 h-4 text-[#287653]" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold font-serif text-base text-[#202820]">
                    {targetStatus === 'collected'
                      ? 'Confirm Food Collection Hand-Off'
                      : 'Confirm Community Delivery'}
                  </h3>
                  <p className="text-xs text-[#667067]">This record will be saved to the permanent audit trail.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReqForModal(null)}
                className="p-1 text-[#667067] hover:text-[#202820] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#202820] uppercase tracking-wider">
                Custody &amp; Inspection Note *
              </label>
              <textarea
                rows={3}
                required
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                placeholder="Document thermal condition, container cleanliness, and responsible parties..."
                className="w-full px-3.5 py-2.5 border border-[#E7E8E1] rounded-xl text-xs sm:text-sm bg-[#FAF9F6] text-[#202820] focus:bg-white focus:ring-2 focus:ring-[#287653] focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E7E8E1]">
              <button
                type="button"
                onClick={() => setSelectedReqForModal(null)}
                className="btn-outline text-xs sm:text-sm py-2 px-4"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoadingId !== null || !statusReason.trim()}
                onClick={handleConfirmStatusUpdate}
                className="btn-primary-brand text-xs sm:text-sm py-2 px-5 disabled:opacity-50"
              >
                {actionLoadingId ? 'Updating...' : 'Confirm State Transition'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
