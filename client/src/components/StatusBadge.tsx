import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  PackageCheck,
  Truck,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  type?: 'listing' | 'request' | 'verification';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = 'listing',
  size = 'md',
}) => {
  const s = status.toLowerCase();
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs sm:text-sm';

  // Listing or Request statuses
  if (s === 'open') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 ${sizeClasses}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Open for Rescue
      </span>
    );
  }

  if (s === 'requested') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-50 text-amber-800 border border-amber-200 ${sizeClasses}`}
      >
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        Request Under Review
      </span>
    );
  }

  if (s === 'assigned' || s === 'approved') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-blue-50 text-blue-800 border border-blue-200 ${sizeClasses}`}
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
        {s === 'assigned' ? 'Partner Assigned' : 'Request Approved'}
      </span>
    );
  }

  if (s === 'collected') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 ${sizeClasses}`}
      >
        <Truck className="w-3.5 h-3.5 text-indigo-600" />
        Collected & In Transit
      </span>
    );
  }

  if (s === 'delivered') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 ${sizeClasses}`}
      >
        <PackageCheck className="w-3.5 h-3.5 text-emerald-700" />
        Successfully Delivered
      </span>
    );
  }

  if (s === 'cancelled' || s === 'rejected') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-gray-100 text-gray-700 border border-gray-200 ${sizeClasses}`}
      >
        <XCircle className="w-3.5 h-3.5 text-gray-500" />
        {s === 'cancelled' ? 'Listing Cancelled' : 'Request Declined'}
      </span>
    );
  }

  if (s === 'expired') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-rose-50 text-rose-800 border border-rose-200 ${sizeClasses}`}
      >
        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
        Deadline Expired
      </span>
    );
  }

  // Verification status
  if (type === 'verification') {
    if (s === 'verified') {
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 ${sizeClasses}`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Verified Partner
        </span>
      );
    }
    if (s === 'pending') {
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-50 text-amber-800 border border-amber-300 ${sizeClasses}`}
        >
          <Clock className="w-4 h-4 text-amber-600" />
          Verification Pending Review
        </span>
      );
    }
    if (s === 'rejected') {
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-rose-50 text-rose-800 border border-rose-300 ${sizeClasses}`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          Verification Rejected
        </span>
      );
    }
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-gray-50 text-gray-700 border border-gray-200 ${sizeClasses}`}
      >
        <Clock className="w-3.5 h-3.5 text-gray-500" />
        Not Submitted
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center font-medium rounded-full bg-gray-100 text-gray-700 ${sizeClasses}`}>
      {status}
    </span>
  );
};
