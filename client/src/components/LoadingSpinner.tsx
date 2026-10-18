import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'md',
}) => {
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[160px]">
      <Loader2 className={`${iconSizes[size]} text-[#174D3A] animate-spin mb-3`} />
      {message && <p className="text-xs sm:text-sm text-[#68736A] font-medium">{message}</p>}
    </div>
  );
};
