import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  description = 'No activity yet. Create a listing or review demo records to see how BhojanSetu tracks recovery.',
  actionText,
  actionHref,
  onAction,
  icon,
}) => {
  return (
    <div className="card-light border-dashed border-[#E7E8E1] p-8 sm:p-12 text-center max-w-lg mx-auto animate-fade-in bg-white">
      <div className="w-14 h-14 rounded-2xl bg-[#DDEBDD] text-[#287653] flex items-center justify-center mx-auto mb-4 shadow-2xs">
        {icon || <PackageOpen className="w-7 h-7" />}
      </div>
      <h3 className="text-lg sm:text-xl font-bold font-serif text-[#202820] mb-1.5">{title}</h3>
      <p className="text-xs sm:text-sm text-[#667067] mb-6 leading-relaxed">{description}</p>

      {actionText && actionHref && (
        <Link
          to={actionHref}
          className="btn-primary-brand text-xs sm:text-sm"
        >
          {actionText}
        </Link>
      )}

      {actionText && onAction && !actionHref && (
        <button
          type="button"
          onClick={onAction}
          className="btn-primary-brand text-xs sm:text-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
