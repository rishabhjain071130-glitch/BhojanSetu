import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { request } from '../api/client.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { ErrorAlert } from '../components/ErrorAlert.js';
import { FoodSafetyBanner } from '../components/FoodSafetyBanner.js';
import {
  ShieldCheck,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Save,
} from 'lucide-react';

export const PartnerProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [organizationName, setOrganizationName] = useState(user?.organizationName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [partnerCapacity, setPartnerCapacity] = useState(
    user?.partnerCapacity?.toString() || '150'
  );
  const [partnerServiceArea, setPartnerServiceArea] = useState(
    user?.partnerServiceArea || 'Central Delhi'
  );
  const [verificationNote, setVerificationNote] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [submittingVerification, setSubmittingVerification] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setOrganizationName(user.organizationName || '');
      setPhone(user.phone || '');
      setPartnerCapacity(user.partnerCapacity?.toString() || '150');
      setPartnerServiceArea(user.partnerServiceArea || 'Central Delhi');
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      setError(null);
      setMessage(null);

      await request('/partners/me', {
        method: 'PATCH',
        body: JSON.stringify({
          organizationName,
          phone,
          partnerCapacity: parseFloat(partnerCapacity),
          partnerServiceArea,
        }),
      });

      await refreshUser();
      setMessage('Partner profile updated successfully.');
    } catch (err: any) {
      setError(err.message || 'Failed to update partner profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSubmitVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmittingVerification(true);
      setError(null);
      setMessage(null);

      await request('/partners/me/verification', {
        method: 'POST',
        body: JSON.stringify({ note: verificationNote }),
      });

      await refreshUser();
      setVerificationNote('');
      setMessage('Verification request submitted for platform admin review.');
    } catch (err: any) {
      setError(err.message || 'Failed to submit verification request.');
    } finally {
      setSubmittingVerification(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Recovery Organization Profile
          </span>
          <StatusBadge status={user.verificationStatus} type="verification" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-gray-950 flex items-center gap-2.5">
          <ShieldCheck className="w-7 h-7 text-emerald-800" />
          Partner Standing & Capacity Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Maintain your rescue vehicle capacity, primary operating locality, and platform verification.
        </p>
      </div>

      <FoodSafetyBanner compact />

      {error && <ErrorAlert message={error} />}
      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          {message}
        </div>
      )}

      {/* Verification Status Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-800" />
              Platform Verification Standing
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Admin review status governs your ability to claim and receive surplus food assignments.
            </p>
          </div>
          <StatusBadge status={user.verificationStatus} type="verification" />
        </div>

        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-2">
          <div className="font-semibold text-gray-800">
            {user.verificationStatus === 'verified' && (
              <span className="text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Verified Recovery Partner
              </span>
            )}
            {user.verificationStatus === 'pending' && (
              <span className="text-amber-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-700" /> Verification Review in Progress
              </span>
            )}
            {user.verificationStatus === 'rejected' && (
              <span className="text-rose-800 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-700" /> Verification Incomplete or Declined
              </span>
            )}
          </div>
          <p className="text-gray-600 leading-relaxed">
            {user.verificationNote
              ? `Admin Review Note: "${user.verificationNote}"`
              : 'Submit your organization registration details, volunteer capacity, or food handler safety declarations below for review by the coordination desk.'}
          </p>
        </div>

        {/* Verification Submission Form if pending or not_submitted */}
        {user.verificationStatus !== 'verified' && (
          <form onSubmit={handleSubmitVerification} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Submit / Update Verification Details for Admin
              </label>
              <textarea
                rows={3}
                required
                value={verificationNote}
                onChange={(e) => setVerificationNote(e.target.value)}
                placeholder="State your registered NGO trust name, food rescue equipment, insulated storage containers, or volunteer team size..."
                className="w-full p-2.5 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={submittingVerification}
              className="px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              {submittingVerification ? 'Submitting...' : 'Submit Verification Request'}
            </button>
          </form>
        )}
      </div>

      {/* Operational Profile & Capacity Form */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-xs space-y-6">
        <div className="pb-3 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-800" />
            Operational Capacity & Service Zone
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            These parameters feed into the Rule-Based Matching Engine for candidate ranking.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Organization Name
            </label>
            <input
              type="text"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Coordinator Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Vehicle / Rescue Capacity (Units)
            </label>
            <input
              type="number"
              min="10"
              required
              value={partnerCapacity}
              onChange={(e) => setPartnerCapacity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
            <span className="text-[10px] text-gray-500">
              Maximum batch quantity your vehicle or facility can safely handle at one time.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Primary Operating Locality
            </label>
            <input
              type="text"
              required
              value={partnerServiceArea}
              onChange={(e) => setPartnerServiceArea(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={savingProfile}
            className="px-5 py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {savingProfile ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
