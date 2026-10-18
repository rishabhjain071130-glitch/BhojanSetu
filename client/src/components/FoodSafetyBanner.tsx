import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FoodSafetyBannerProps {
  compact?: boolean;
}

export const FoodSafetyBanner: React.FC<FoodSafetyBannerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="bg-amber-50/90 border border-amber-200/80 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Coordination Protocol Notice:</span> BhojanSetu facilitates
          operational logistics. Physical inspection, safe holding temperatures, and food-safety suitability
          must be confirmed by responsible personnel prior to hand-off.{' '}
          <Link to="/food-safety" className="font-medium underline hover:text-amber-950">
            View guidelines
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-emerald-900/5 border border-emerald-900/15 rounded-xl p-4 sm:p-5 text-sm text-gray-800">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-emerald-100/80 text-emerald-800 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-semibold text-emerald-950 flex items-center gap-2">
            Food Safety & Platform Coordination Notice
            <span className="text-xs font-normal px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
              Non-Certifier Scope
            </span>
          </h4>
          <p className="text-gray-700 leading-relaxed text-xs sm:text-sm">
            BhojanSetu supports coordination and traceability only. Food suitability must be assessed
            by responsible people before collection and distribution. Always follow applicable food-safety
            standards, proper thermal storage conditions, and physical sensory inspection. Software status
            never replaces human inspection.
          </p>
          <div className="pt-1">
            <Link
              to="/food-safety"
              className="inline-flex items-center gap-1 text-xs font-medium text-emerald-800 hover:text-emerald-950 underline"
            >
              <Info className="w-3.5 h-3.5" />
              Read full surplus food safety & handling standards
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
