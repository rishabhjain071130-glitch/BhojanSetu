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
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-gray-200 text-gray-700">
        <AlertTriangle className="w-3 h-3 text-gray-500" />
        Expired
      </span>
    );
  }

  if (diffHours <= 2) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
        <Flame className="w-3 h-3 text-red-600 animate-bounce" />
        Urgent: {diffHours < 1 ? `${Math.round(diffHours * 60)}m left` : `${diffHours.toFixed(1)}h left`}
      </span>
    );
  }

  if (diffHours <= 4) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
        <Clock className="w-3 h-3 text-amber-600" />
        {diffHours.toFixed(1)}h remaining
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
      <Clock className="w-3 h-3 text-emerald-600" />
      {Math.round(diffHours)}h window
    </span>
  );
};
