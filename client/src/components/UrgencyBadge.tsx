import React from 'react';
import { Flame, Clock, AlertTriangle } from 'lucide-react';

interface UrgencyBadgeProps {
  deadline: string;
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ deadline }) => {
  const deadlineTime = new Date(deadline).getTime();
  const now = Date.now();
  const diffHours = (deadlineTime - now) / (1000 * 60 * 60);

  if (diffHours <= 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-200 text-stone-700">
        <AlertTriangle className="w-3 h-3 text-stone-500" />
        Expired
      </span>
    );
  }

  if (diffHours <= 2) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
        <Flame className="w-3.5 h-3.5 text-rose-600" />
        Urgent: {diffHours < 1 ? `${Math.round(diffHours * 60)}m left` : `${diffHours.toFixed(1)}h left`}
      </span>
    );
  }

  if (diffHours <= 4) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
        <Clock className="w-3.5 h-3.5 text-amber-700" />
        {diffHours.toFixed(1)}h remaining
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#DDEBDD] text-[#287653] border border-[#287653]/15">
      <Clock className="w-3.5 h-3.5 text-[#287653]" />
      {Math.round(diffHours)}h window
    </span>
  );
};
