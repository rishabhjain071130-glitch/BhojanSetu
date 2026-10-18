import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { UserCheck, Sparkles, ChevronRight, AlertCircle } from 'lucide-react';
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
      badgeColor: 'bg-[#DDE8D8] text-[#174D3A]',
    },
    {
      role: 'partner',
      title: 'Verified Partner',
      sub: 'Annapurna Seva Trust (Capacity: 250)',
      email: 'partner.verified@bhojansetu.demo',
      icon: '🤝',
      badge: 'Verified Rescuer',
      badgeColor: 'bg-blue-100 text-blue-900',
    },
    {
      role: 'partner',
      title: 'Pending Partner',
      sub: 'Navjeevan Rescue (Gated)',
      email: 'partner.pending@bhojansetu.demo',
      icon: '⏳',
      badge: 'Pending Review',
      badgeColor: 'bg-amber-100 text-amber-900',
    },
    {
      role: 'admin',
      title: 'Platform Admin',
      sub: 'Central Coordination Desk',
      email: 'admin@bhojansetu.demo',
      icon: '🛡️',
      badge: 'Admin Console',
      badgeColor: 'bg-purple-100 text-purple-900',
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
      setErrorMsg(err.message || 'Quick sign-in failed. Please ensure the server is active.');
    } finally {
      setLoadingEmail(null);
    }
  };

  return (
    <div className={`card-editorial ${compact ? 'p-3' : 'p-4 sm:p-6'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#174D3A] text-white flex items-center justify-center text-xs font-bold">
            <Sparkles className="w-4 h-4 text-[#E7A85B]" />
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#174D3A]">
              Hackathon Evaluation Fast-Track
            </h3>
            <p className="text-xs text-[#68736A]">
              Instant one-click role switching to test the full event recovery lifecycle
            </p>
          </div>
        </div>
        {user && (
          <span className="text-xs text-[#202820] bg-[#DDE8D8]/60 border border-[#174D3A]/20 px-3 py-1 rounded-full flex items-center gap-1.5 self-start sm:self-auto font-medium">
            <span className="w-2 h-2 rounded-full bg-[#237653]" />
            Active: <strong className="capitalize">{user.role}</strong> ({user.name.split(' ')[0]})
          </span>
        )}
      </div>

      {errorMsg && (
        <div className="mb-3 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-xl p-2.5 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {demoAccounts.map((acc) => {
          const isActive = user?.email === acc.email;
          const isLoading = loadingEmail === acc.email;

          return (
            <button
              key={acc.email}
              type="button"
              onClick={() => handleQuickLogin(acc.email)}
              disabled={isLoading || isActive}
              className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                isActive
                  ? 'border-[#174D3A] bg-[#DDE8D8]/40 shadow-xs ring-1 ring-[#174D3A]/30'
                  : 'border-stone-200 bg-stone-50/70 hover:bg-white hover:border-[#237653] hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl" role="img" aria-label={acc.title}>
                    {acc.icon}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${acc.badgeColor}`}>
                    {acc.badge}
                  </span>
                </div>
                <div className="font-bold text-[#202820] text-sm">{acc.title}</div>
                <div className="text-xs text-[#68736A] truncate mt-0.5">{acc.sub}</div>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-stone-200/80 flex items-center justify-between text-xs font-semibold">
                {isActive ? (
                  <span className="text-[#174D3A] flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" /> Currently signed in
                  </span>
                ) : (
                  <span className="text-[#237653] flex items-center gap-1 group-hover:underline">
                    {isLoading ? 'Switching...' : 'Switch to role'}
                    <ChevronRight className="w-3.5 h-3.5" />
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
