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
    <div className="card-editorial border-dashed p-8 sm:p-12 text-center max-w-lg mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-[#DDE8D8] text-[#174D3A] flex items-center justify-center mx-auto mb-4">
        {icon || <PackageOpen className="w-7 h-7" />}
      </div>
      <h3 className="text-lg sm:text-xl font-bold font-serif text-[#202820] mb-1.5">{title}</h3>
      <p className="text-xs sm:text-sm text-[#68736A] mb-6 leading-relaxed">{description}</p>

      {actionText && actionHref && (
        <Link
          to={actionHref}
          className="inline-flex items-center justify-center px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl text-white bg-[#174D3A] hover:bg-[#237653] transition-all shadow-xs"
        >
          {actionText}
        </Link>
      )}

      {actionText && onAction && !actionHref && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center justify-center px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl text-white bg-[#174D3A] hover:bg-[#237653] transition-all shadow-xs"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
