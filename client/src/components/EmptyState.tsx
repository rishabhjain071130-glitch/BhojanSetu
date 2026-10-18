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
    <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 sm:p-12 text-center max-w-lg mx-auto">
      <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4">
        {icon || <PackageOpen className="w-6 h-6" />}
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed">{description}</p>

      {actionText && actionHref && (
        <Link
          to={actionHref}
          className="inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-medium rounded-lg text-white bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-xs"
        >
          {actionText}
        </Link>
      )}

      {actionText && onAction && !actionHref && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-medium rounded-lg text-white bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-xs"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
