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
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Demo Account Switcher Header */}
      <div className="space-y-2 text-center">
        <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center mx-auto shadow-xs">
          <UtensilsCrossed className="w-5 h-5 text-emerald-200" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-gray-950">
          Sign In to BhojanSetu
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          For hackathon demo review, use the fast-track account switcher below or enter credentials.
        </p>
      </div>

      <DemoAccountSelector />

      <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
          Or Enter Account Credentials
        </h2>

        {error && <ErrorAlert message={error} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. organizer@bhojansetu.demo"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              'Authenticating...'
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-600">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-emerald-800 hover:underline">
            Register as Organizer or Partner <ArrowRight className="w-3 h-3 inline" />
          </Link>
        </div>
      </div>
    </div>
  );
};
