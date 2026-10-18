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

  // Verification status
  if (type === 'verification') {
    if (s === 'verified') {
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-[#DCEFE2] text-[#174C3C] border border-[#174C3C]/20 shadow-2xs ${sizeClasses}`}
        >
          <ShieldCheck className="w-4 h-4 text-[#2D8061]" />
          Verified Partner
        </span>
      );
    }
    if (s === 'pending') {
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#E9B76A]/40 ${sizeClasses}`}
        >
          <Clock className="w-4 h-4 text-[#D97706]" />
          Pending Review
        </span>
      );
    }
    if (s === 'rejected') {
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-rose-50 text-rose-800 border border-rose-200 ${sizeClasses}`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-700" />
          Verification Declined
        </span>
      );
    }
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-stone-100 text-[#66756B] border border-[#E3E8E0] ${sizeClasses}`}
      >
        <Clock className="w-3.5 h-3.5 text-stone-400" />
        Not Submitted
      </span>
    );
  }

  // Listing or Request statuses
  if (s === 'open') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-[#DCEFE2] text-[#174C3C] border border-[#174C3C]/20 shadow-2xs ${sizeClasses}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#2D8061] animate-pulse" />
        Open for Rescue
      </span>
    );
  }

  if (s === 'requested') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#E9B76A]/40 ${sizeClasses}`}
      >
        <Clock className="w-3.5 h-3.5 text-[#D97706]" />
        Requested
      </span>
    );
  }

  if (s === 'assigned' || s === 'approved') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-[#DCEFE2] text-[#174C3C] border border-[#174C3C]/20 shadow-2xs ${sizeClasses}`}
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-[#2D8061]" />
        {s === 'assigned' ? 'Partner Assigned' : 'Request Approved'}
      </span>
    );
  }

  if (s === 'collected') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#E9B76A]/40 ${sizeClasses}`}
      >
        <Truck className="w-3.5 h-3.5 text-[#D97706]" />
        Collected &amp; In Transit
      </span>
    );
  }

  if (s === 'delivered') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-[#DCEFE2] text-[#174C3C] border border-[#174C3C]/20 font-semibold shadow-2xs ${sizeClasses}`}
      >
        <PackageCheck className="w-3.5 h-3.5 text-[#2D8061]" />
        Delivered
      </span>
    );
  }

  if (s === 'cancelled' || s === 'rejected') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-stone-100 text-[#66756B] border border-[#E3E8E0] ${sizeClasses}`}
      >
        <XCircle className="w-3.5 h-3.5 text-stone-400" />
        {s === 'cancelled' ? 'Cancelled' : 'Declined'}
      </span>
    );
  }

  if (s === 'expired') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-rose-50 text-rose-800 border border-rose-200 ${sizeClasses}`}
      >
        <AlertCircle className="w-3.5 h-3.5 text-rose-700" />
        Expired
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center font-medium rounded-full bg-stone-100 text-[#66756B] ${sizeClasses}`}>
      {status}
    </span>
  );
};
