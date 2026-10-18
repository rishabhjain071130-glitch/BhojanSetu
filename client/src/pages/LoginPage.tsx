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
        <div className="w-12 h-12 rounded-2xl bg-[#174D3A] text-white flex items-center justify-center mx-auto shadow-sm">
          <UtensilsCrossed className="w-6 h-6 text-[#E7A85B]" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#202820]">
          Sign In to BhojanSetu
        </h1>
        <p className="text-xs sm:text-sm text-[#68736A] max-w-md mx-auto">
          For evaluation, switch between all 4 role perspectives with one click, or enter credentials below.
        </p>
      </div>

      <DemoAccountSelector />

      <div className="max-w-md mx-auto card-editorial p-6 sm:p-8">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#174D3A] mb-4">
          Or Enter Account Credentials
        </h2>

        {error && <ErrorAlert message={error} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#202820] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. organizer@bhojansetu.demo"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#174D3A] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202820] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#174D3A] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-[#174D3A] hover:bg-[#237653] text-white font-semibold text-xs sm:text-sm shadow-xs transition-all hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              'Authenticating...'
            ) : (
              <>
                <LogIn className="w-4 h-4 text-[#E7A85B]" /> Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-stone-100 text-center text-xs text-[#68736A]">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-[#174D3A] hover:underline">
            Register as Organizer or Partner <ArrowRight className="w-3 h-3 inline" />
          </Link>
        </div>
      </div>
    </div>
  );
};
