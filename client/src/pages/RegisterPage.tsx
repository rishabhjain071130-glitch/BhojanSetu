import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { ErrorAlert } from '../components/ErrorAlert.js';
import { UtensilsCrossed, UserPlus, Building2, HeartHandshake } from 'lucide-react';
import { UserRole } from '../types/index.js';

export const RegisterPage: React.FC = () => {
  const [role, setRole] = useState<'organizer' | 'partner'>('organizer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [phone, setPhone] = useState('');
  const [partnerCapacity, setPartnerCapacity] = useState('150');
  const [partnerServiceArea, setPartnerServiceArea] = useState('Central Delhi');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<any[]>([]);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setErrorDetails([]);

      const payload: any = {
        name,
        email,
        password,
        role,
        organizationName,
        phone,
      };

      if (role === 'partner') {
        payload.partnerCapacity = parseFloat(partnerCapacity) || 150;
        payload.partnerServiceArea = partnerServiceArea;
      }

      await register(payload);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
      if (err.details) setErrorDetails(err.details);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10 sm:py-14 animate-fade-in">
      <div className="card-light p-6 sm:p-9 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#174C3C] text-[#DCEFE2] flex items-center justify-center mx-auto shadow-sm">
            <UtensilsCrossed className="w-6 h-6 text-[#DCEFE2]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#18372D]">Join BhojanSetu</h1>
          <p className="text-xs sm:text-sm text-[#66756B]">
            Create an account to coordinate or rescue surplus event food.
          </p>
        </div>

        {error && <ErrorAlert message={error} details={errorDetails} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role selector buttons */}
          <div>
            <label className="block text-xs font-semibold text-[#18372D] uppercase tracking-wider mb-2">
              Select Your Operational Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('organizer')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                  role === 'organizer'
                    ? 'border-[#174C3C] bg-[#DCEFE2]/70 ring-1 ring-[#174C3C]'
                    : 'border-[#E3E8E0] bg-white hover:bg-[#EEF4ED]'
                }`}
              >
                <div
                  className={`p-2 rounded-xl transition-colors ${
                    role === 'organizer' ? 'bg-[#174C3C] text-[#DCEFE2]' : 'bg-[#EEF4ED] text-[#174C3C]'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#18372D]">Event Organizer / Caterer</div>
                  <div className="text-[11px] text-[#66756B]">List surplus food</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('partner')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                  role === 'partner'
                    ? 'border-[#174C3C] bg-[#DCEFE2]/70 ring-1 ring-[#174C3C]'
                    : 'border-[#E3E8E0] bg-white hover:bg-[#EEF4ED]'
                }`}
              >
                <div
                  className={`p-2 rounded-xl transition-colors ${
                    role === 'partner' ? 'bg-[#174C3C] text-[#DCEFE2]' : 'bg-[#EEF4ED] text-[#174C3C]'
                  }`}
                >
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#18372D]">Recovery Partner / NGO</div>
                  <div className="text-[11px] text-[#66756B]">Collect &amp; redistribute</div>
                </div>
              </button>
            </div>
            <p className="text-[11px] text-[#66756B] mt-1.5 italic">
              * Note: Platform administrative roles are pre-seeded and cannot be registered publicly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#18372D] uppercase tracking-wider mb-1">
                Full Contact Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Nair"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3E8E0] text-xs sm:text-sm bg-[#F8F7F2] focus:bg-white focus:ring-2 focus:ring-[#2D8061] focus:outline-none transition-all text-[#18372D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#18372D] uppercase tracking-wider mb-1">
                Organization / Caterer Name
              </label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder={role === 'organizer' ? 'Royal Grand Banquets' : 'Annapurna Seva Trust'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3E8E0] text-xs sm:text-sm bg-[#F8F7F2] focus:bg-white focus:ring-2 focus:ring-[#2D8061] focus:outline-none transition-all text-[#18372D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#18372D] uppercase tracking-wider mb-1">
                Official Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@organization.org"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3E8E0] text-xs sm:text-sm bg-[#F8F7F2] focus:bg-white focus:ring-2 focus:ring-[#2D8061] focus:outline-none transition-all text-[#18372D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#18372D] uppercase tracking-wider mb-1">
                Direct Contact Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3E8E0] text-xs sm:text-sm bg-[#F8F7F2] focus:bg-white focus:ring-2 focus:ring-[#2D8061] focus:outline-none transition-all text-[#18372D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#18372D] uppercase tracking-wider mb-1">
              Create Secure Password * (min 6 chars)
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3E8E0] text-xs sm:text-sm bg-[#F8F7F2] focus:bg-white focus:ring-2 focus:ring-[#2D8061] focus:outline-none transition-all text-[#18372D]"
            />
          </div>

          {/* Partner Specific Configuration */}
          {role === 'partner' && (
            <div className="p-4 bg-[#EEF4ED] rounded-2xl border border-[#E3E8E0] space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#174C3C] block">
                Partner Operational Capacity &amp; Service Zone
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#18372D] mb-1">
                    Pickup Capacity (Units / kg / boxes)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="5000"
                    required
                    value={partnerCapacity}
                    onChange={(e) => setPartnerCapacity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E3E8E0] text-xs sm:text-sm bg-white text-[#18372D]"
                  />
                  <span className="text-[10px] text-[#66756B] mt-1 block">
                    Used by the Rule-Based Matching Engine to assess load suitability.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#18372D] mb-1">
                    Primary Service Locality / Area
                  </label>
                  <input
                    type="text"
                    required
                    value={partnerServiceArea}
                    onChange={(e) => setPartnerServiceArea(e.target.value)}
                    placeholder="e.g. South Delhi, Saket"
                    className="w-full px-3 py-2 rounded-xl border border-[#E3E8E0] text-xs sm:text-sm bg-white text-[#18372D]"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary-brand py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              'Creating Account...'
            ) : (
              <>
                <UserPlus className="w-4 h-4 text-[#DCEFE2]" /> Complete Registration
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-[#E3E8E0] text-center text-xs text-[#66756B]">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-[#174C3C] hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
