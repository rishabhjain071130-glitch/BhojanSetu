import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { DemoAccountSelector } from '../components/DemoAccountSelector.js';
import { ErrorAlert } from '../components/ErrorAlert.js';
import { UtensilsCrossed, LogIn, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14 space-y-8 animate-fade-in">
      {/* Demo Account Switcher Header */}
      <div className="space-y-2 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#F0F4EE] text-[#287653] flex items-center justify-center mx-auto border border-[#E7E8E1]">
          <UtensilsCrossed className="w-6 h-6 text-[#287653]" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#202820]">
          Sign In to BhojanSetu
        </h1>
        <p className="text-xs sm:text-sm text-[#667067] max-w-md mx-auto">
          For evaluation, switch between all 4 role perspectives with one click, or enter credentials below.
        </p>
      </div>

      <DemoAccountSelector />

      <div className="max-w-md mx-auto card-light p-6 sm:p-8 bg-white border border-[#E7E8E1]">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#287653] mb-4">
          Or Enter Account Credentials
        </h2>

        {error && <ErrorAlert message={error} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#202820] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. organizer@bhojansetu.demo"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E8E1] text-xs sm:text-sm bg-[#FAF9F6] text-[#202820] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#287653] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202820] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E8E1] text-xs sm:text-sm bg-[#FAF9F6] text-[#202820] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#287653] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary-brand text-xs sm:text-sm py-2.5 shadow-2xs disabled:opacity-50"
          >
            {loading ? (
              'Authenticating...'
            ) : (
              <>
                <LogIn className="w-4 h-4 text-white" /> Sign In
              </>
            )}
          </button>
        </form>

        <div className="pt-4 text-center text-xs text-[#667067] border-t border-[#E7E8E1] mt-5">
          Don&apos;t have an account yet?{' '}
          <Link to="/register" className="font-bold text-[#287653] hover:underline">
            Register your organization
          </Link>
        </div>
      </div>
    </div>
  );
};
