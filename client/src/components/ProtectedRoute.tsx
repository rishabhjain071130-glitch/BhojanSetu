import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { UserRole } from '../types/index.js';
import { LoadingSpinner } from './LoadingSpinner.js';
import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireVerifiedPartner?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requireVerifiedPartner = false,
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner message="Checking authentication session..." size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white border border-rose-200 rounded-2xl text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Access Restricted</h3>
        <p className="text-sm text-gray-600 mb-6">
          This section requires <strong>{allowedRoles.join(' or ')}</strong> privileges. Your current role is{' '}
          <strong className="capitalize">{user.role}</strong>.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-emerald-700 hover:bg-emerald-800 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  if (requireVerifiedPartner && user.role === 'partner' && user.verificationStatus !== 'verified') {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white border border-amber-200 rounded-2xl text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Partner Verification Required</h3>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          Your recovery partner account is currently in <strong>{user.verificationStatus}</strong> status.
          Under BhojanSetu safety guidelines, only verified partners can claim food rescue assignments.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/partner/profile"
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-emerald-700 hover:bg-emerald-800 transition-colors"
          >
            Check Verification Status
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
