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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Recovery Operations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-gray-950 flex items-center gap-2.5">
            <ClipboardList className="w-7 h-7 text-emerald-800" />
            My Requests, Pickups & Hand-Off Timeline
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Track status progression with full audit history from approval to final community delivery.
          </p>
        </div>

        <Link
          to="/listings"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors self-start sm:self-auto"
        >
          Browse More Surplus Food
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
                className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-xs space-y-5"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-gray-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={req.status} type="request" />
                      <span className="text-xs text-gray-400 font-mono">
                        Ref: {req._id.slice(-6)}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-gray-900">
                      {listing?.foodTitle || 'Surplus Food Batch'}
                    </h2>

                    <div className="text-xs text-gray-600">
                      Event: <strong className="text-gray-800">{listing?.eventName}</strong> • Area:{' '}
                      <strong>{listing?.areaOrAddress}</strong>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1 text-right">
                    <span className="text-xs text-gray-500 font-medium">Requested Surplus</span>
                    <div className="text-xl font-bold text-emerald-900">
                      {req.requestedQuantity}{' '}
                      <span className="text-xs font-semibold">{listing?.unit || 'units'}</span>
                    </div>
                  </div>
                </div>

                {/* Private Pickup Hand-Off Details (Unlocked once approved) */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-800">
                    {req.status === 'approved' ||
                    req.status === 'collected' ||
                    req.status === 'delivered' ? (
                      <>
                        <Unlock className="w-3.5 h-3.5 text-emerald-700" /> Private Pickup Instructions
                        (Unlocked)
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-amber-700" /> Private Pickup Instructions
                        (Locked until approval)
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-700 font-medium">
                    {listing?.pickupInstructions ||
                      '🔒 Pickup instructions will unlock upon verified organizer approval.'}
                  </p>
                </div>

                {/* Action Buttons for Hand-Off transitions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    My collection note: <span className="text-gray-800 italic font-medium">"{req.collectionNote}"</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {canCollect && (
                      <button
                        type="button"
                        onClick={() => openStatusModal(req, 'collected')}
                        className="px-4 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Truck className="w-4 h-4" /> Record Collection (Loaded)
                      </button>
                    )}

                    {canDeliver && (
                      <button
                        type="button"
                        onClick={() => openStatusModal(req, 'delivered')}
                        className="px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <PackageCheck className="w-4 h-4" /> Record Delivery (Completed)
                      </button>
                    )}

                    {listing?._id && (
                      <Link
                        to={`/listings/${listing._id}`}
                        className="px-3 py-2 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Listing Details
                      </Link>
                    )}
                  </div>
                </div>

                {/* Chronological Status History Timeline */}
                {req.statusHistory && req.statusHistory.length > 0 && (
                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                      <History className="w-3.5 h-3.5" /> Chronological Traceability Audit History
                    </span>
                    <div className="space-y-1.5 pl-2 border-l-2 border-emerald-800/30">
                      {req.statusHistory.map((item, idx) => (
                        <div key={idx} className="text-xs text-gray-600 flex flex-wrap items-baseline gap-2">
                          <span className="font-semibold text-gray-900 capitalize">
                            [{item.newStatus}]
                          </span>
                          <span className="text-gray-500 text-[11px]">
                            {new Date(item.timestamp).toLocaleString([], {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </span>
                          <span className="text-gray-700">
                            by {item.actorName} ({item.actorRole})
                          </span>
                          {item.reason && (
                            <span className="text-gray-500 italic">— "{item.reason}"</span>
                          )}
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

      {/* Hand-Off Transition Modal */}
      {selectedReqForModal && targetStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-950 font-serif flex items-center gap-2">
              {targetStatus === 'collected' ? (
                <>
                  <Truck className="w-5 h-5 text-indigo-700" /> Confirm Food Collection
                </>
              ) : (
                <>
                  <PackageCheck className="w-5 h-5 text-emerald-800" /> Confirm Final Distribution
                </>
              )}
            </h3>

            <p className="text-xs text-gray-600 leading-relaxed">
              {targetStatus === 'collected'
                ? 'Recording collection signifies you have arrived on-site, verified temperature/handling conditions, and loaded the surplus into your recovery vehicle.'
                : 'Recording delivery certifies the rescued food was safely distributed to community kitchen meal recipients or shelter beneficiaries.'}
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Hand-Off Verification Note *
              </label>
              <textarea
                rows={3}
                required
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedReqForModal(null);
                  setTargetStatus(null);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={actionLoadingId !== null}
                onClick={handleConfirmStatusUpdate}
                className="px-5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-xs disabled:opacity-50"
              >
                {actionLoadingId ? 'Saving...' : 'Confirm Hand-Off Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
