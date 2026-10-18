import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4">
        <UtensilsCrossed className="w-6 h-6" />
      </div>
      <h1 className="text-3xl font-bold font-serif text-gray-900 mb-2">404 — Page Not Found</h1>
      <p className="text-sm text-gray-600 max-w-md mb-6 leading-relaxed">
        The destination you are looking for does not exist on BhojanSetu or has been relocated.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-800 text-white font-semibold text-sm shadow-xs hover:bg-emerald-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Home
      </Link>
    </div>
  );
};
