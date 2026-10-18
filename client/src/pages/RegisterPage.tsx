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
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center mx-auto shadow-xs">
            <UtensilsCrossed className="w-5 h-5 text-emerald-200" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-gray-950">Join BhojanSetu</h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Create an account to coordinate or rescue surplus event food.
          </p>
        </div>

        {error && <ErrorAlert message={error} details={errorDetails} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role selector buttons */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Select Your Operational Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('organizer')}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  role === 'organizer'
                    ? 'border-emerald-800 bg-emerald-50/70 ring-1 ring-emerald-800'
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    role === 'organizer' ? 'bg-emerald-800 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Event Organizer / Caterer</div>
                  <div className="text-[11px] text-gray-500">List surplus food</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('partner')}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  role === 'partner'
                    ? 'border-emerald-800 bg-emerald-50/70 ring-1 ring-emerald-800'
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    role === 'partner' ? 'bg-emerald-800 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Recovery Partner / NGO</div>
                  <div className="text-[11px] text-gray-500">Collect & redistribute</div>
                </div>
              </button>
            </div>
            <p className="text-[11px] text-gray-500 mt-1.5">
              * Note: Administrative roles are pre-seeded and cannot be registered publicly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Full Contact Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Nair"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Organization / Caterer Name
              </label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder={role === 'organizer' ? 'Royal Grand Banquets' : 'Annapurna Seva Trust'}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Official Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@organization.org"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Direct Contact Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Create Secure Password * (min 6 chars)
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>

          {/* Partner Specific Configuration */}
          {role === 'partner' && (
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/60 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block">
                Partner Operational Capacity & Service Zone
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Pickup Capacity (Units / kg / boxes)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="5000"
                    required
                    value={partnerCapacity}
                    onChange={(e) => setPartnerCapacity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white"
                  />
                  <span className="text-[10px] text-gray-500">
                    Used by the Rule-Based Matching Engine to assess load suitability.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Primary Service Locality / Area
                  </label>
                  <input
                    type="text"
                    required
                    value={partnerServiceArea}
                    onChange={(e) => setPartnerServiceArea(e.target.value)}
                    placeholder="e.g. South Delhi, Saket"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              'Creating Account...'
            ) : (
              <>
                <UserPlus className="w-4 h-4" /> Complete Registration
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-gray-100 text-center text-xs text-gray-600">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-emerald-800 hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
