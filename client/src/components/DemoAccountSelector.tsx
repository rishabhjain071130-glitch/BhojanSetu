import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { UserCheck, Sparkles, LogIn, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DemoAccountSelectorProps {
  onSelect?: () => void;
  compact?: boolean;
}

export const DemoAccountSelector: React.FC<DemoAccountSelectorProps> = ({
  onSelect,
  compact = false,
}) => {
  const { user, login } = useAuth();
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const demoAccounts = [
    {
      role: 'organizer',
      title: 'Event Organizer',
      sub: 'Royal Grand Banquets',
      email: 'organizer@bhojansetu.demo',
      icon: '👨‍🍳',
      badge: 'Listing Creator',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      role: 'partner',
      title: 'Verified Partner',
      sub: 'Annapurna Seva Trust (Capacity: 250)',
      email: 'partner.verified@bhojansetu.demo',
      icon: '🤝',
      badge: 'Verified Rescuer',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      role: 'partner',
      title: 'Pending Partner',
      sub: 'Navjeevan Rescue (Unverified)',
      email: 'partner.pending@bhojansetu.demo',
      icon: '⏳',
      badge: 'Gated Test',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      role: 'admin',
      title: 'Platform Admin',
      sub: 'Central Coordination Desk',
      email: 'admin@bhojansetu.demo',
      icon: '🛡️',
      badge: 'Reviewer',
      badgeColor: 'bg-purple-100 text-purple-800',
    },
  ];

  const handleQuickLogin = async (email: string) => {
    try {
      setLoadingEmail(email);
      setErrorMsg(null);
      await login(email, 'Password123!');
      if (onSelect) onSelect();
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Quick sign-in failed. Please ensure server is running.');
    } finally {
      setLoadingEmail(null);
    }
  };

  return (
    <div className={`bg-white rounded-xl border border-emerald-900/10 shadow-xs ${compact ? 'p-3' : 'p-4 sm:p-5'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-900">
              Hackathon Evaluation Fast-Track
            </span>
            <span className="hidden sm:inline text-xs text-gray-500 ml-2">
              (One-click switch between all 4 role perspectives)
            </span>
          </div>
        </div>
        {user && (
          <span className="text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md flex items-center gap-1.5 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Active: <strong className="text-gray-900 capitalize">{user.role}</strong> ({user.name.split(' ')[0]})
          </span>
        )}
      </div>

      {errorMsg && (
        <div className="mb-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded p-2">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {demoAccounts.map((acc) => {
          const isActive = user?.email === acc.email;
          const isLoading = loadingEmail === acc.email;

          return (
            <button
              key={acc.email}
              type="button"
              onClick={() => handleQuickLogin(acc.email)}
              disabled={isLoading || isActive}
              className={`text-left p-3 rounded-lg border transition-all flex flex-col justify-between ${
                isActive
                  ? 'border-emerald-700 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-700/30'
                  : 'border-gray-200 bg-gray-50/70 hover:bg-white hover:border-emerald-600 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl" role="img" aria-label={acc.title}>
                    {acc.icon}
                  </span>
                  <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${acc.badgeColor}`}>
                    {acc.badge}
                  </span>
                </div>
                <div className="font-semibold text-gray-900 text-xs sm:text-sm">{acc.title}</div>
                <div className="text-[11px] text-gray-500 truncate mt-0.5">{acc.sub}</div>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-center justify-between text-xs font-medium">
                {isActive ? (
                  <span className="text-emerald-800 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" /> Currently signed in
                  </span>
                ) : (
                  <span className="text-emerald-700 flex items-center gap-1 group-hover:underline">
                    {isLoading ? 'Switching...' : 'Switch to this role'}
                    <ChevronRight className="w-3 h-3" />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
