import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  details?: Array<{ field?: string; message: string }> | string[];
  onRetry?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, details, onRetry }) => {
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-900 my-4 shadow-xs">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="font-semibold text-sm text-rose-950">{message}</div>

          {details && details.length > 0 && (
            <ul className="mt-2 list-disc list-inside text-xs space-y-1 text-rose-800">
              {details.map((d, idx) => (
                <li key={idx}>
                  {typeof d === 'string' ? d : `${d.field ? `${d.field}: ` : ''}${d.message}`}
                </li>
              ))}
            </ul>
          )}

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-rose-800 hover:text-rose-950 underline"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry action
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
