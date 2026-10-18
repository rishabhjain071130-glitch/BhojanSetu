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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2 pb-6 border-b border-[#E7E8E1]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#287653] bg-[#DDEBDD] px-3 py-0.5 rounded-full border border-[#E7E8E1]">
            Recovery Organization Profile
          </span>
          <StatusBadge status={user.verificationStatus} type="verification" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#202820] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F0F4EE] text-[#287653] flex items-center justify-center shrink-0 border border-[#E7E8E1]">
            <ShieldCheck className="w-5 h-5 text-[#287653]" />
          </div>
          Partner Standing &amp; Capacity
        </h1>
        <p className="text-xs sm:text-sm text-[#667067]">
          Maintain your rescue vehicle capacity, primary operating locality, and platform verification.
        </p>
      </div>

      <FoodSafetyBanner compact />

      {error && <ErrorAlert message={error} />}
      {message && (
        <div className="p-4 rounded-2xl bg-[#DDEBDD] border border-[#E7E8E1] text-[#202820] text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-5 h-5 text-[#287653] shrink-0" />
          {message}
        </div>
      )}

      {/* Verification Status Card */}
      <div className="card-light p-6 sm:p-8 space-y-4 bg-white border border-[#E7E8E1]">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold font-serif text-[#202820] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#287653]" />
              Platform Verification Standing
            </h2>
            <p className="text-xs text-[#667067] mt-0.5">
              Admin review status governs your ability to claim and receive surplus food assignments.
            </p>
          </div>
          <StatusBadge status={user.verificationStatus} type="verification" />
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#F0F4EE] border border-[#E7E8E1] text-xs space-y-2">
          <div className="font-bold text-[#202820]">
            {user.verificationStatus === 'verified' && (
              <span className="text-[#287653] flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#287653]" /> Verified Recovery Partner
              </span>
            )}
            {user.verificationStatus === 'pending' && (
              <span className="text-amber-900 flex items-center gap-1.5 font-bold">
                <Clock className="w-4 h-4 text-amber-700" /> Verification Review in Progress
              </span>
            )}
            {user.verificationStatus === 'rejected' && (
              <span className="text-rose-900 flex items-center gap-1.5 font-bold">
                <AlertCircle className="w-4 h-4 text-rose-600" /> Verification Incomplete or Declined
              </span>
            )}
          </div>
          <p className="text-[#667067] leading-relaxed">
            {user.verificationNote
              ? `Admin Review Note: "${user.verificationNote}"`
              : 'Submit your organization registration details, volunteer capacity, or food handler safety declarations below for review by the coordination desk.'}
          </p>
        </div>

        {/* Verification Submission Form if pending or not_submitted */}
        {user.verificationStatus !== 'verified' && (
          <form onSubmit={handleSubmitVerification} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#202820] uppercase tracking-wider mb-1.5">
                Submit / Update Verification Details for Admin
              </label>
              <textarea
                rows={3}
                required
                value={verificationNote}
                onChange={(e) => setVerificationNote(e.target.value)}
                placeholder="State your registered NGO trust name, food rescue equipment, insulated storage containers, or volunteer team size..."
                className="w-full p-3 border border-[#E7E8E1] rounded-xl text-xs sm:text-sm bg-[#FAF9F6] text-[#202820] focus:bg-white focus:ring-2 focus:ring-[#287653] focus:outline-hidden transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={submittingVerification}
              className="btn-primary-brand text-xs py-2 px-5 shadow-2xs disabled:opacity-50"
            >
              <FileText className="w-4 h-4 text-white" />
              {submittingVerification ? 'Submitting...' : 'Submit Verification Request'}
            </button>
          </form>
        )}
      </div>

      {/* Operational Profile & Capacity Form */}
      <form onSubmit={handleSaveProfile} className="card-light p-6 sm:p-8 space-y-6 bg-white border border-[#E7E8E1]">
        <div className="pb-3 border-b border-[#E7E8E1]">
          <h2 className="text-base font-bold font-serif text-[#202820] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#287653]" />
            Operational Capacity &amp; Service Zone
          </h2>
          <p className="text-xs text-[#667067] mt-0.5">
            These parameters feed into the Rule-Based Matching Engine for candidate ranking.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#202820] uppercase tracking-wider mb-1.5">
              Organization Name
            </label>
            <input
              type="text"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-[#E7E8E1] rounded-xl text-xs sm:text-sm bg-[#FAF9F6] text-[#202820] focus:bg-white focus:ring-2 focus:ring-[#287653] focus:outline-hidden transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202820] uppercase tracking-wider mb-1.5">
              Coordinator Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-[#E7E8E1] rounded-xl text-xs sm:text-sm bg-[#FAF9F6] text-[#202820] focus:bg-white focus:ring-2 focus:ring-[#287653] focus:outline-hidden transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202820] uppercase tracking-wider mb-1.5">
              Vehicle / Rescue Capacity (Units)
            </label>
            <input
              type="number"
              min="10"
              required
              value={partnerCapacity}
              onChange={(e) => setPartnerCapacity(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-[#E7E8E1] rounded-xl text-xs sm:text-sm bg-[#FAF9F6] text-[#202820] focus:bg-white focus:ring-2 focus:ring-[#287653] focus:outline-hidden transition-all"
            />
            <span className="text-[10px] text-[#667067] mt-1 block">
              Maximum batch quantity your vehicle or facility can safely handle at one time.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202820] uppercase tracking-wider mb-1.5">
              Primary Operating Locality
            </label>
            <input
              type="text"
              required
              value={partnerServiceArea}
              onChange={(e) => setPartnerServiceArea(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-[#E7E8E1] rounded-xl text-xs sm:text-sm bg-[#FAF9F6] text-[#202820] focus:bg-white focus:ring-2 focus:ring-[#287653] focus:outline-hidden transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={savingProfile}
            className="btn-primary-brand text-xs sm:text-sm py-2.5 px-6 shadow-2xs disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-white" />
            {savingProfile ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
