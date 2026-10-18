import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FoodSafetyBannerProps {
  compact?: boolean;
}

export const FoodSafetyBanner: React.FC<FoodSafetyBannerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="bg-[#F0F4EE] border border-[#E7E8E1] rounded-xl p-3.5 text-xs text-[#202820] flex items-start gap-2.5 shadow-2xs">
        <ShieldCheck className="w-4 h-4 text-[#287653] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#202820]">Coordination Protocol:</span> BhojanSetu facilitates
          operational logistics. Physical sensory inspection, safe holding temperatures, and food suitability
          must be confirmed by responsible personnel prior to hand-off.{' '}
          <Link to="/food-safety" className="font-semibold text-[#287653] underline hover:text-[#1f5c41]">
            View guidelines →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card-light p-5 sm:p-6 text-sm text-[#202820] bg-white border border-[#E7E8E1] rounded-2xl">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-[#DDEBDD] text-[#287653] shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1.5">
          <h4 className="font-bold font-serif text-[#202820] flex items-center gap-2 text-base">
            Food Safety &amp; Platform Coordination Boundary
            <span className="text-[11px] font-sans font-semibold px-2 py-0.5 bg-[#DDEBDD] text-[#287653] rounded-full border border-[#287653]/15">
              Non-Certifier Scope
            </span>
          </h4>
          <p className="text-[#667067] leading-relaxed text-xs sm:text-sm">
            BhojanSetu supports coordination and traceability only. Food suitability must be assessed
            by responsible personnel before collection and distribution. Always follow applicable food-safety
            standards, proper thermal storage conditions (&gt;65°C hot, &lt;5°C cold), and physical sensory inspection. Software status
            never replaces human inspection.
          </p>
          <div className="pt-1">
            <Link
              to="/food-safety"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#287653] hover:underline"
            >
              <Info className="w-3.5 h-3.5" />
              Read full surplus food safety &amp; handling standards →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
