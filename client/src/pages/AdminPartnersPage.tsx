import React, { useEffect, useState } from 'react';
import { request } from '../api/client.js';
import { User, VerificationStatus } from '../types/index.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { LoadingSpinner } from '../components/LoadingSpinner.js';
import { ErrorAlert } from '../components/ErrorAlert.js';
import { FoodSafetyBanner } from '../components/FoodSafetyBanner.js';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Check,
  AlertTriangle,
  X,
} from 'lucide-react';

export const AdminPartnersPage: React.FC = () => {
  const [partners, setPartners] = useState<User[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verification modal/action state
  const [actionPartner, setActionPartner] = useState<User | null>(null);
  const [actionStatus, setActionStatus] = useState<'verified' | 'rejected'>('verified');
  const [reviewNote, setReviewNote] = useState('');
  const [savingAction, setSavingAction] = useState(false);

  useEffect(() => {
    fetchPartners();
  }, [statusFilter]);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      setError(null);
      const url =
        statusFilter === 'all'
          ? '/partners/admin'
          : `/partners/admin?status=${statusFilter}`;
      const data = await request<{ partners: User[] }>(url);
      setPartners(data.partners || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch recovery partners.');
    } finally {
      setLoading(false);
    }
  };

  const openDecisionModal = (partner: User, status: 'verified' | 'rejected') => {
    setActionPartner(partner);
    setActionStatus(status);
    setReviewNote(
      status === 'verified'
        ? 'Verified registration certificate and certified volunteer hygiene declarations'
        : 'Incomplete documentation; re-submission requested'
    );
  };

  const handleConfirmDecision = async () => {
    if (!actionPartner) return;
    try {
      setSavingAction(true);
      setError(null);

      await request(`/partners/admin/${actionPartner.id || (actionPartner as any)._id}/verification`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: actionStatus,
          note: reviewNote,
        }),
      });

      setActionPartner(null);
      fetchPartners();
    } catch (err: any) {
      setError(err.message || 'Failed to update partner verification.');
    } finally {
      setSavingAction(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E8E1]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#287653]">
            <span className="w-2 h-2 rounded-full bg-[#287653]" />
            Platform Coordination Desk
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#202820] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0F4EE] text-[#287653] flex items-center justify-center shrink-0 border border-[#E7E8E1]">
              <ShieldCheck className="w-5 h-5 text-[#287653]" />
            </div>
            Partner Verification Console
          </h1>
          <p className="text-xs sm:text-sm text-[#667067]">
            Review partner organizations, capacity standing, and grant or revoke rescue eligibility.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#667067]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 border border-[#E7E8E1] rounded-xl text-xs font-bold bg-white text-[#202820] focus:outline-hidden focus:ring-2 focus:ring-[#287653]"
          >
            <option value="all">All Verification States</option>
            <option value="pending">Pending Review</option>
            <option value="verified">Verified Partners</option>
            <option value="rejected">Rejected / Declined</option>
          </select>
        </div>
      </div>

      <FoodSafetyBanner compact />

      {error && <ErrorAlert message={error} onRetry={fetchPartners} />}

      {loading ? (
        <LoadingSpinner message="Loading partner verification roster..." size="lg" />
      ) : partners.length === 0 ? (
        <div className="card-light p-10 text-center text-xs text-[#667067] bg-white border border-[#E7E8E1]">
          No partner accounts match the selected verification filter.
        </div>
      ) : (
        <div className="card-light overflow-hidden bg-white border border-[#E7E8E1]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FAF9F6] text-[#667067] font-semibold uppercase text-[10px] tracking-wider border-b border-[#E7E8E1]">
                <tr>
                  <th className="px-6 py-3.5">Organization / Rep</th>
                  <th className="px-6 py-3.5">Service Area</th>
                  <th className="px-6 py-3.5">Vehicle Capacity</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E8E1] text-[#202820]">
                {partners.map((partner) => {
                  const pId = partner.id || (partner as any)._id;
                  const isVerified = partner.verificationStatus === 'verified';
                  const isPending = partner.verificationStatus === 'pending';

                  return (
                    <tr key={pId} className="hover:bg-[#FAF9F6] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#202820]">
                          {partner.organizationName || partner.name}
                        </div>
                        <div className="text-xs text-[#667067]">
                          Rep: {partner.name} ({partner.email})
                        </div>
                        {partner.phone && (
                          <div className="text-[11px] text-[#667067] mt-0.5">Phone: {partner.phone}</div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-medium text-[#202820]">
                          {partner.partnerServiceArea || 'NCR General Zone'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-bold text-[#287653]">
                          {partner.partnerCapacity || 0} units
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={partner.verificationStatus} type="verification" />
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isVerified && (
                            <button
                              type="button"
                              onClick={() => openDecisionModal(partner, 'verified')}
                              className="btn-primary-brand text-xs py-1.5 px-3"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                              Approve
                            </button>
                          )}

                          {isVerified && (
                            <button
                              type="button"
                              onClick={() => openDecisionModal(partner, 'rejected')}
                              className="px-3 py-1.5 rounded-xl border border-rose-300 text-xs font-semibold text-rose-800 hover:bg-rose-50 transition-colors"
                            >
                              Revoke
                            </button>
                          )}

                          {isPending && (
                            <button
                              type="button"
                              onClick={() => openDecisionModal(partner, 'rejected')}
                              className="px-3 py-1.5 rounded-xl border border-[#E7E8E1] text-xs font-semibold text-[#667067] hover:bg-stone-50 transition-colors"
                            >
                              Decline
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Decision Dialog Modal */}
      {actionPartner && (
        <div
          role="dialog"
          aria-label="Partner Verification Action"
          className="fixed inset-0 z-50 bg-[#202820]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="card-light p-6 sm:p-7 max-w-lg w-full space-y-5 animate-slide-up shadow-xl bg-white border border-[#E7E8E1]">
            <div className="flex items-start justify-between pb-3 border-b border-[#E7E8E1]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#DDEBDD] text-[#287653] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-[#287653]" />
                </div>
                <div>
                  <h3 className="font-bold font-serif text-base text-[#202820]">
                    {actionStatus === 'verified'
                      ? 'Approve Partner Eligibility'
                      : 'Decline / Revoke Verification'}
                  </h3>
                  <p className="text-xs text-[#667067]">
                    Organization: {actionPartner.organizationName || actionPartner.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActionPartner(null)}
                className="p-1 text-[#667067] hover:text-[#202820] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#202820] uppercase tracking-wider">
                Audit &amp; Compliance Verification Note *
              </label>
              <textarea
                rows={3}
                required
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="State verified documents, capacity verification, or reason for status decision..."
                className="w-full px-3.5 py-2.5 border border-[#E7E8E1] rounded-xl text-xs sm:text-sm bg-[#FAF9F6] text-[#202820] focus:bg-white focus:ring-2 focus:ring-[#287653] focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E7E8E1]">
              <button
                type="button"
                onClick={() => setActionPartner(null)}
                className="btn-outline text-xs sm:text-sm py-2 px-4"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={savingAction || !reviewNote.trim()}
                onClick={handleConfirmDecision}
                className={`text-xs sm:text-sm py-2 px-5 rounded-xl font-bold transition-all ${
                  actionStatus === 'verified'
                    ? 'btn-primary-brand'
                    : 'bg-rose-700 hover:bg-rose-800 text-white shadow-xs'
                }`}
              >
                {savingAction
                  ? 'Saving...'
                  : actionStatus === 'verified'
                  ? 'Confirm Verification'
                  : 'Confirm Decline'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
