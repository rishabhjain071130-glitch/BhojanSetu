import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-[#DDE8D8] text-[#174D3A] flex items-center justify-center mx-auto mb-4">
        <UtensilsCrossed className="w-7 h-7 text-[#174D3A]" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#202820] mb-2">404 — Page Not Found</h1>
      <p className="text-xs sm:text-sm text-[#68736A] max-w-md mb-6 leading-relaxed">
        The destination you are looking for does not exist on BhojanSetu or has been relocated.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#174D3A] hover:bg-[#237653] text-white font-semibold text-xs sm:text-sm shadow-xs transition-all hover:scale-[1.01]"
      >
        <ArrowLeft className="w-4 h-4 text-[#E7A85B]" /> Return to Home
      </Link>
    </div>
  );
};
