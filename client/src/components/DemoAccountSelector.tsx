import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { UserCheck, Sparkles, ChevronRight, AlertCircle, ChefHat, HeartHandshake, Clock, ShieldCheck } from 'lucide-react';
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
      icon: ChefHat,
      badge: 'Listing Creator',
      badgeColor: 'bg-[#DCEFE2] text-[#174C3C] border border-[#174C3C]/20',
    },
    {
      role: 'partner',
      title: 'Verified Partner',
      sub: 'Annapurna Seva Trust (Capacity: 250)',
      email: 'partner.verified@bhojansetu.demo',
      icon: HeartHandshake,
      badge: 'Verified Rescuer',
      badgeColor: 'bg-[#DCEFE2] text-[#174C3C] border border-[#174C3C]/30 font-bold',
    },
    {
      role: 'partner',
      title: 'Pending Partner',
      sub: 'Navjeevan Rescue (Gated)',
      email: 'partner.pending@bhojansetu.demo',
      icon: Clock,
      badge: 'Pending Review',
      badgeColor: 'bg-[#FEF3C7] text-[#92400E] border border-[#E9B76A]/40',
    },
    {
      role: 'admin',
      title: 'Platform Admin',
      sub: 'Central Coordination Desk',
      email: 'admin@bhojansetu.demo',
      icon: ShieldCheck,
      badge: 'Admin Console',
      badgeColor: 'bg-[#EEF4ED] text-[#174C3C] border border-[#174C3C]/20',
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
      setErrorMsg(err.message || 'Login failed. Please verify the backend is running.');
    } finally {
      setLoadingEmail(null);
    }
  };

  return (
    <div className="space-y-3">
      {!compact && (
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-[#174C3C] text-[#DCEFE2] flex items-center justify-center text-xs shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#18372D]">
              Evaluation Quick Access
            </h4>
            <p className="text-[11px] text-[#66756B]">Select a pre-configured role to inspect the platform</p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className={`grid ${compact ? 'grid-cols-1 sm:grid-cols-2 gap-2' : 'grid-cols-1 gap-2.5'}`}>
        {demoAccounts.map((account, idx) => {
          const isCurrent = user?.email === account.email;
          const isLoading = loadingEmail === account.email;
          const IconComp = account.icon;

          return (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickLogin(account.email)}
              className={`text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                isCurrent
                  ? 'border-[#2D8061] bg-[#EEF4ED] shadow-xs ring-1 ring-[#2D8061]'
                  : 'border-[#E3E8E0] bg-white hover:border-[#174C3C]/40 hover:bg-[#F8F7F2]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#F8F7F2] border border-[#E3E8E0] flex items-center justify-center text-[#174C3C] shrink-0">
                  <IconComp className="w-4 h-4 text-[#2D8061]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#18372D] truncate">
                      {account.title}
                    </span>
                    <span
                      className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-full ${account.badgeColor}`}
                    >
                      {account.badge}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#66756B] truncate">
                    {account.sub}
                  </div>
                </div>
              </div>

              <div className="shrink-0 ml-2">
                {isLoading ? (
                  <span className="text-[11px] font-semibold text-[#174C3C]">...</span>
                ) : isCurrent ? (
                  <span className="text-[11px] font-bold text-[#2D8061] flex items-center gap-0.5">
                    <UserCheck className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#66756B] group-hover:text-[#174C3C] group-hover:translate-x-0.5 transition-transform" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
