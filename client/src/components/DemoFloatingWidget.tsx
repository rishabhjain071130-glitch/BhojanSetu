import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Sparkles, X, ChevronRight, UserCheck, Shield, Users, Building, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DemoFloatingWidget: React.FC = () => {
  const { user, login } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
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
      color: 'border-emerald-700/30 bg-emerald-50/50',
    },
    {
      role: 'partner',
      title: 'Verified Partner',
      sub: 'Annapurna Seva Trust (Cap: 250)',
      email: 'partner.verified@bhojansetu.demo',
      icon: '🤝',
      badge: 'Verified Rescuer',
      color: 'border-blue-700/30 bg-blue-50/50',
    },
    {
      role: 'partner',
      title: 'Pending Partner',
      sub: 'Navjeevan Rescue (Gated)',
      email: 'partner.pending@bhojansetu.demo',
      icon: '⏳',
      badge: 'Pending Review',
      color: 'border-amber-700/30 bg-amber-50/50',
    },
    {
      role: 'admin',
      title: 'Platform Admin',
      sub: 'Coordination & Verification',
      email: 'admin@bhojansetu.demo',
      icon: '🛡️',
      badge: 'Admin Console',
      color: 'border-purple-700/30 bg-purple-50/50',
    },
  ];

  const handleQuickLogin = async (email: string) => {
    try {
      setLoadingEmail(email);
      setErrorMsg(null);
      await login(email, 'Password123!');
      setIsOpen(false);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Quick sign-in failed. Please ensure the server is active.');
    } finally {
      setLoadingEmail(null);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Expanded Modal/Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Demo Role Switcher"
          className="mb-3 w-[340px] sm:w-[380px] bg-white rounded-2xl border border-[#174D3A]/20 shadow-2xl p-4 sm:p-5 animate-slide-up backdrop-blur-md"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#174D3A]/10">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#174D3A] text-white text-xs">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#174D3A]">
                  Demo Evaluation Mode
                </h3>
                <p className="text-[11px] text-[#68736A]">Switch roles to test complete workflow</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-[#68736A] hover:text-[#202820] hover:bg-stone-100 transition-colors"
              aria-label="Close demo panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {errorMsg && (
            <div className="mt-2.5 p-2 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="mt-3 space-y-2">
            {demoAccounts.map((acc) => {
              const isActive = user?.email === acc.email;
              const isLoading = loadingEmail === acc.email;

              return (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleQuickLogin(acc.email)}
                  disabled={isLoading || isActive}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isActive
                      ? 'border-[#174D3A] bg-[#DDE8D8]/40 ring-1 ring-[#174D3A]/40'
                      : 'border-stone-200 bg-stone-50/60 hover:bg-white hover:border-[#237653] hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl shrink-0" role="img" aria-label={acc.title}>
                      {acc.icon}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#202820] truncate">{acc.title}</span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-white border border-stone-200 text-[#68736A]">
                          {acc.badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#68736A] truncate">{acc.sub}</div>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    {isActive ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#174D3A]">
                        <UserCheck className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[11px] font-semibold text-[#237653] hover:underline">
                        {isLoading ? '...' : 'Switch'}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#174D3A]/10 text-[10px] text-[#68736A] text-center">
            Passwords preloaded. Real JWT authentication enforced on all endpoints.
          </div>
        </div>
      )}

      {/* Floating Pill Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#174D3A] text-white shadow-xl hover:bg-[#237653] hover:shadow-2xl transition-all border border-emerald-400/20 focus:outline-none focus:ring-2 focus:ring-[#E7A85B]"
        title="Toggle Demo Role Switcher"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E7A85B] text-[#174D3A] text-xs font-bold">
          ⚡
        </span>
        <span className="text-xs font-semibold tracking-wide">
          {user ? (
            <span className="flex items-center gap-1.5">
              <span>Demo Role:</span>
              <span className="capitalize font-bold text-[#E7A85B]">{user.role}</span>
            </span>
          ) : (
            <span>Try Demo Mode</span>
          )}
        </span>
      </button>
    </div>
  );
};
