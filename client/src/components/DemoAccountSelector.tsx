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
      badgeColor: 'bg-[#DDEBDD] text-[#287653] border border-[#287653]/20',
    },
    {
      role: 'partner',
      title: 'Verified Partner',
      sub: 'Annapurna Seva Trust (Capacity: 250)',
      email: 'partner.verified@bhojansetu.demo',
      icon: HeartHandshake,
      badge: 'Verified Rescuer',
      badgeColor: 'bg-[#DDEBDD] text-[#287653] border border-[#287653]/25 font-bold',
    },
    {
      role: 'partner',
      title: 'Pending Partner',
      sub: 'Navjeevan Rescue (Gated)',
      email: 'partner.pending@bhojansetu.demo',
      icon: Clock,
      badge: 'Pending Review',
      badgeColor: 'bg-[#FEF3C7] text-[#92400E] border border-[#E9AE62]/40',
    },
    {
      role: 'admin',
      title: 'Platform Admin',
      sub: 'Central Coordination Desk',
      email: 'admin@bhojansetu.demo',
      icon: ShieldCheck,
      badge: 'Admin Console',
      badgeColor: 'bg-[#F0F4EE] text-[#287653] border border-[#287653]/20',
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
          <div className="w-6 h-6 rounded-lg bg-[#287653] text-white flex items-center justify-center text-xs shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#202820]">
              Evaluation Quick Access
            </h4>
            <p className="text-[11px] text-[#667067]">Select a pre-configured role to inspect the platform</p>
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
              className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                isCurrent
                  ? 'ring-2 ring-[#287653] border-[#287653] bg-[#F0F4EE] shadow-xs'
                  : 'border-[#E7E8E1] bg-[#FAF9F6] hover:border-[#287653]/40 hover:bg-white hover:shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#E7E8E1] flex items-center justify-center text-[#287653] shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                  <IconComp className="w-4 h-4 text-[#287653]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#202820]">{account.title}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${account.badgeColor}`}>
                      {account.badge}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#667067] truncate max-w-[220px]">
                    {account.sub}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[#287653]">
                {isLoading ? (
                  <span className="text-[11px] font-semibold text-[#287653]">Entering...</span>
                ) : isCurrent ? (
                  <span className="text-[11px] font-bold text-[#287653] flex items-center gap-0.5">
                    <UserCheck className="w-3.5 h-3.5" /> Active
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-[#667067]" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
