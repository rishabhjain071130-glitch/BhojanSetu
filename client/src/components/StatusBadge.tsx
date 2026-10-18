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
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  // Listing or Request statuses
  if (s === 'open') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-[#DDE8D8]/80 text-[#174D3A] border border-[#174D3A]/20 ${sizeClasses}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#237653] animate-pulse" />
        Open for Rescue
      </span>
    );
  }

  if (s === 'requested') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-amber-50 text-amber-900 border border-amber-300 ${sizeClasses}`}
      >
        <Clock className="w-3.5 h-3.5 text-amber-700" />
        Under Review
      </span>
    );
  }

  if (s === 'assigned' || s === 'approved') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-blue-50 text-blue-900 border border-blue-300 ${sizeClasses}`}
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
        {s === 'assigned' ? 'Partner Assigned' : 'Request Approved'}
      </span>
    );
  }

  if (s === 'collected') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-amber-50 text-amber-900 border border-amber-300 ${sizeClasses}`}
      >
        <Truck className="w-3.5 h-3.5 text-amber-700" />
        Collected &amp; In Transit
      </span>
    );
  }

  if (s === 'delivered') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-[#DDE8D8] text-[#174D3A] border border-[#174D3A]/30 ${sizeClasses}`}
      >
        <PackageCheck className="w-3.5 h-3.5 text-[#174D3A]" />
        Successfully Delivered
      </span>
    );
  }

  if (s === 'cancelled' || s === 'rejected') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-stone-100 text-stone-700 border border-stone-200 ${sizeClasses}`}
      >
        <XCircle className="w-3.5 h-3.5 text-stone-500" />
        {s === 'cancelled' ? 'Listing Cancelled' : 'Request Declined'}
      </span>
    );
  }

  if (s === 'expired') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-rose-50 text-rose-900 border border-rose-300 ${sizeClasses}`}
      >
        <AlertCircle className="w-3.5 h-3.5 text-rose-700" />
        Deadline Expired
      </span>
    );
  }

  // Verification status
  if (type === 'verification') {
    if (s === 'verified') {
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-[#DDE8D8] text-[#174D3A] border border-[#174D3A]/30 ${sizeClasses}`}
        >
          <ShieldCheck className="w-4 h-4 text-[#237653]" />
          Verified Partner
        </span>
      );
    }
    if (s === 'pending') {
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-amber-50 text-amber-900 border border-amber-300 ${sizeClasses}`}
        >
          <Clock className="w-4 h-4 text-amber-700" />
          Verification Pending Review
        </span>
      );
    }
    if (s === 'rejected') {
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-rose-50 text-rose-900 border border-rose-300 ${sizeClasses}`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-700" />
          Verification Declined
        </span>
      );
    }
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-stone-100 text-stone-700 border border-stone-200 ${sizeClasses}`}
      >
        <Clock className="w-3.5 h-3.5 text-stone-500" />
        Not Submitted
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center font-medium rounded-full bg-stone-100 text-stone-700 ${sizeClasses}`}>
      {status}
    </span>
  );
};
