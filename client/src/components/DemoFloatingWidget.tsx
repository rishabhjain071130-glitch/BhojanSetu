import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Sparkles,
  X,
  ChevronRight,
  UserCheck,
  ChefHat,
  HeartHandshake,
  Clock,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
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
      icon: ChefHat,
      badge: 'Listing Creator',
    },
    {
      role: 'partner',
      title: 'Verified Partner',
      sub: 'Annapurna Seva Trust (Cap: 250)',
      email: 'partner.verified@bhojansetu.demo',
      icon: HeartHandshake,
      badge: 'Verified Rescuer',
    },
    {
      role: 'partner',
      title: 'Pending Partner',
      sub: 'Navjeevan Rescue (Gated)',
      email: 'partner.pending@bhojansetu.demo',
      icon: Clock,
      badge: 'Pending Review',
    },
    {
      role: 'admin',
      title: 'Platform Admin',
      sub: 'Coordination & Verification',
      email: 'admin@bhojansetu.demo',
      icon: ShieldCheck,
      badge: 'Admin Console',
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
          className="mb-3 w-[340px] sm:w-[380px] bg-white rounded-2xl border border-[#E7E8E1] shadow-xl p-4 sm:p-5 animate-slide-up backdrop-blur-md"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#E7E8E1]">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#287653] text-white text-xs shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#202820]">
                  Judge &amp; Demo Evaluation
                </h3>
                <p className="text-[11px] text-[#667067]">1-Click role switcher for testing workflows</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-[#667067] hover:text-[#202820] hover:bg-stone-100 transition-colors"
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

          <div className="mt-3 space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {demoAccounts.map((acc, idx) => {
              const isCurrent = user?.email === acc.email;
              const isLoading = loadingEmail === acc.email;
              const IconComp = acc.icon;

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleQuickLogin(acc.email)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                    isCurrent
                      ? 'ring-2 ring-[#287653] border-[#287653] bg-[#F0F4EE] shadow-xs'
                      : 'border-[#E7E8E1] bg-[#FAF9F6] hover:border-[#287653]/40 hover:bg-white hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#E7E8E1] flex items-center justify-center text-[#287653] shrink-0 shadow-2xs">
                      <IconComp className="w-4 h-4 text-[#287653]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#202820]">{acc.title}</span>
                        <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-white border border-[#E7E8E1] text-[#287653]">
                          {acc.badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#667067] truncate max-w-[200px]">
                        {acc.sub}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[#287653]">
                    {isLoading ? (
                      <span className="text-[11px] font-semibold text-[#287653]">Logging in...</span>
                    ) : isCurrent ? (
                      <span className="text-[11px] font-bold text-[#287653] flex items-center gap-0.5">
                        <UserCheck className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#E7E8E1] flex items-center justify-between text-[11px] text-[#667067]">
            <span>Fast-track switcher • Instant testing</span>
            {user && (
              <span className="font-semibold text-[#287653]">
                Logged in: {user.name}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#287653] text-white shadow-xl hover:bg-[#1f5c41] transition-all duration-300 hover:scale-105 border border-[#DDEBDD]/30"
        aria-label="Open Demo Account Switcher"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DDEBDD] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#DDEBDD]" />
        </span>
        <span className="text-xs font-bold tracking-wide">Demo Roles</span>
        <Sparkles className="w-3.5 h-3.5 text-[#DDEBDD] group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
};
