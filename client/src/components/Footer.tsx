import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ShieldCheck, HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & mission */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4 text-emerald-200" />
              </div>
              <span className="text-xl font-bold text-white font-serif">BhojanSetu</span>
            </div>
            <p className="text-sm font-medium text-emerald-400">
              Good food deserves a destination, not a dustbin.
            </p>
            <p className="text-xs text-gray-400 max-w-md leading-relaxed">
              An event-based surplus food recovery and redistribution platform designed for weddings,
              banquets, corporate catering, and large community functions across India.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-gray-800 text-amber-300 border border-amber-900/40">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Hackathon Prototype • Verified Demo Data
              </span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-2 text-sm">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider">Platform</h4>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li>
                <Link to="/listings" className="hover:text-emerald-400 transition-colors">
                  Browse Surplus Food
                </Link>
              </li>
              <li>
                <Link to="/impact" className="hover:text-emerald-400 transition-colors">
                  Impact Dashboard
                </Link>
              </li>
              <li>
                <Link to="/food-safety" className="hover:text-emerald-400 transition-colors">
                  Food Safety & Storage Rules
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">
                  Demo Accounts Switcher
                </Link>
              </li>
            </ul>
          </div>

          {/* Coordination Scope */}
          <div className="space-y-2 text-sm">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider">Safety & Scope</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              BhojanSetu is an operational coordination tool, not a food safety certification agency.
              All food recovery requires on-site temperature checking and physical inspection by authorized handlers.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
          <div>
            &copy; {new Date().getFullYear()} BhojanSetu. Built for Hackathon Submission.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/food-safety" className="hover:text-gray-300">
              Safety Guidelines
            </Link>
            <span>•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5" /> Empowering Community Food Rescue
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
