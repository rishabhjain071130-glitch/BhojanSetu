import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Sparkles,
  X,
  ChevronRight,
  UserCheck,
  Shield,
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
      color: 'border-[#235347]/30 bg-[#DAF1DE]/40',
    },
    {
      role: 'partner',
      title: 'Verified Partner',
      sub: 'Annapurna Seva Trust (Cap: 250)',
      email: 'partner.verified@bhojansetu.demo',
      icon: HeartHandshake,
      badge: 'Verified Rescuer',
      color: 'border-[#235347]/30 bg-[#DAF1DE]/70',
    },
    {
      role: 'partner',
      title: 'Pending Partner',
      sub: 'Navjeevan Rescue (Gated)',
      email: 'partner.pending@bhojansetu.demo',
      icon: Clock,
      badge: 'Pending Review',
      color: 'border-amber-400/30 bg-amber-50/70',
    },
    {
      role: 'admin',
      title: 'Platform Admin',
      sub: 'Coordination & Verification',
      email: 'admin@bhojansetu.demo',
      icon: ShieldCheck,
      badge: 'Admin Console',
      color: 'border-[#163832]/30 bg-[#EAF6EC]',
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
          className="mb-3 w-[340px] sm:w-[380px] bg-white rounded-2xl border border-[#235347]/20 shadow-2xl p-4 sm:p-5 animate-slide-up backdrop-blur-md"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#E3E8E0]">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#174C3C] text-[#DCEFE2] text-xs shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#18372D]">
                  Judge &amp; Demo Evaluation
                </h3>
                <p className="text-[11px] text-[#66756B]">1-Click role switcher for testing workflows</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-[#66756B] hover:text-[#18372D] hover:bg-stone-100 transition-colors"
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
                      ? 'ring-2 ring-[#2D8061] border-[#2D8061] bg-[#EEF4ED] shadow-xs'
                      : 'border-[#E3E8E0] bg-[#F8F7F2] hover:border-[#174C3C]/40 hover:bg-white hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#E3E8E0] flex items-center justify-center text-[#174C3C] shrink-0 shadow-2xs">
                      <IconComp className="w-4 h-4 text-[#2D8061]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#18372D]">{acc.title}</span>
                        <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-white border border-[#E3E8E0] text-[#174C3C]">
                          {acc.badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#66756B] truncate max-w-[200px]">
                        {acc.sub}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[#174C3C]">
                    {isLoading ? (
                      <span className="text-[11px] font-semibold text-[#174C3C]">Logging in...</span>
                    ) : isCurrent ? (
                      <span className="text-[11px] font-bold text-[#2D8061] flex items-center gap-0.5">
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

          <div className="mt-3 pt-2.5 border-t border-[#E3E8E0] flex items-center justify-between text-[11px] text-[#66756B]">
            <span>Password: <code className="bg-stone-100 px-1 py-0.5 rounded text-[#18372D]">Password123!</code></span>
            {user && (
              <span className="font-semibold text-[#174C3C]">
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
        className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#174C3C] text-white shadow-xl hover:bg-[#2D8061] transition-all duration-300 hover:scale-105 border border-[#DCEFE2]/30"
        aria-label="Open Demo Account Switcher"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DCEFE2] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#DCEFE2]" />
        </span>
        <span className="text-xs font-bold tracking-wide">Demo Roles</span>
        <Sparkles className="w-3.5 h-3.5 text-[#DCEFE2] group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
};
