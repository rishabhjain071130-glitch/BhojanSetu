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

      await request(`/partners/admin/${actionPartner.id}/verification`, {
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#174D3A]/15">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#174D3A]">
            <span className="w-2 h-2 rounded-full bg-[#237653]" />
            Platform Coordination Desk
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#202820] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#174D3A] text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#E7A85B]" />
            </div>
            Partner Verification Console
          </h1>
          <p className="text-xs sm:text-sm text-[#68736A]">
            Review partner organizations, capacity standing, and grant or revoke rescue eligibility.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#68736A]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 border border-stone-200 rounded-xl text-xs font-semibold bg-white text-[#202820] focus:outline-none focus:ring-2 focus:ring-[#174D3A]"
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
        <LoadingSpinner message="Fetching partner records from database..." size="lg" />
      ) : partners.length === 0 ? (
        <div className="card-editorial p-8 text-center text-sm text-[#68736A]">
          No recovery partners match the selected filter.
        </div>
      ) : (
        <div className="card-editorial overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-50 border-b border-stone-200/80 text-[#68736A] uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-6 py-3.5 font-bold">Organization &amp; Contact</th>
                  <th className="px-6 py-3.5 font-bold">Capacity &amp; Locality</th>
                  <th className="px-6 py-3.5 font-bold">Submitted Notes / Credentials</th>
                  <th className="px-6 py-3.5 font-bold">Current Status</th>
                  <th className="px-6 py-3.5 font-bold text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {partners.map((partner) => {
                  const isPending = partner.verificationStatus === 'pending';
                  const isVerified = partner.verificationStatus === 'verified';

                  return (
                    <tr key={partner.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#202820]">
                          {partner.organizationName || partner.name}
                        </div>
                        <div className="text-xs text-[#68736A]">
                          Rep: {partner.name} • {partner.email}
                        </div>
                        {partner.phone && (
                          <div className="text-[11px] text-[#68736A]">Phone: {partner.phone}</div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-bold text-[#174D3A]">
                          {partner.partnerCapacity || 0} units capacity
                        </div>
                        <div className="text-xs text-[#68736A]">{partner.partnerServiceArea || 'Central'}</div>
                      </td>

                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-xs text-[#202820] italic truncate" title={partner.verificationNote}>
                          "{partner.verificationNote || 'No notes on file'}"
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={partner.verificationStatus} type="verification" size="sm" />
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isVerified ? (
                            <button
                              type="button"
                              onClick={() => openDecisionModal(partner, 'verified')}
                              className="px-3.5 py-1.5 rounded-xl bg-[#174D3A] hover:bg-[#237653] text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#E7A85B]" /> Approve
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => openDecisionModal(partner, 'rejected')}
                              className="px-3.5 py-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold text-xs transition-colors flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Revoke
                            </button>
                          )}

                          {isPending && (
                            <button
                              type="button"
                              onClick={() => openDecisionModal(partner, 'rejected')}
                              className="px-3.5 py-1.5 rounded-xl border border-stone-200 text-[#68736A] hover:bg-stone-100 font-semibold text-xs transition-colors"
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

      {/* Decision Modal */}
      {actionPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-[#174D3A]/20">
            <h3 className="text-xl font-bold text-[#202820] font-serif flex items-center gap-2">
              {actionStatus === 'verified' ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[#237653]" /> Authorize Partner Verification
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-700" /> Decline / Revoke Verification
                </>
              )}
            </h3>

            <p className="text-xs text-[#68736A] leading-relaxed">
              Updating <strong>{actionPartner.organizationName || actionPartner.name}</strong> to{' '}
              <strong className="text-[#202820]">{actionStatus.toUpperCase()}</strong>.
              {actionStatus === 'verified'
                ? ' This will grant clearance to submit rescue requests and receive surplus food assignments.'
                : ' This will restrict this account from claiming surplus food rescue assignments.'}
            </p>

            <div>
              <label className="block text-xs font-semibold text-[#202820] uppercase tracking-wider mb-1.5">
                Admin Audit Note *
              </label>
              <textarea
                rows={3}
                required
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                className="w-full p-3 border border-stone-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#174D3A] focus:outline-none bg-stone-50/50"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActionPartner(null)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-[#68736A] hover:bg-stone-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={savingAction}
                onClick={handleConfirmDecision}
                className={`px-5 py-2 rounded-xl text-white font-semibold text-xs shadow-xs disabled:opacity-50 transition-colors ${
                  actionStatus === 'verified'
                    ? 'bg-[#174D3A] hover:bg-[#237653]'
                    : 'bg-rose-700 hover:bg-rose-800'
                }`}
              >
                {savingAction ? 'Updating...' : `Confirm ${actionStatus === 'verified' ? 'Approval' : 'Revocation'}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
