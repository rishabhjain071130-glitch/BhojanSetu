import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-[#DDEBDD] text-[#287653] flex items-center justify-center mx-auto mb-4 border border-[#E7E8E1] shadow-2xs">
        <UtensilsCrossed className="w-8 h-8 text-[#287653]" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#202820] mb-2">404 — Page Not Found</h1>
      <p className="text-xs sm:text-sm text-[#667067] max-w-md mb-6 leading-relaxed">
        The destination you are looking for does not exist on BhojanSetu or has been relocated.
      </p>
      <Link
        to="/"
        className="btn-primary-brand inline-flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4 text-white" /> Return to Home
      </Link>
    </div>
  );
};

