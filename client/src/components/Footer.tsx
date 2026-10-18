import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ShieldCheck, HeartHandshake, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#174D3A] text-stone-200 mt-24 border-t border-[#174D3A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-emerald-900/60">
          {/* Brand & mission */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white text-[#174D3A] flex items-center justify-center font-bold">
                <UtensilsCrossed className="w-5 h-5 text-[#174D3A]" />
              </div>
              <span className="text-2xl font-bold font-serif text-white tracking-tight">
                Bhojan<span className="text-[#E7A85B]">Setu</span>
              </span>
            </div>
            <p className="text-sm font-serif italic text-[#E7A85B] text-base">
              "Good food deserves a destination, not a dustbin."
            </p>
            <p className="text-xs text-stone-300 max-w-sm leading-relaxed">
              An event-based surplus-food recovery and redistribution platform connecting event organizers,
              caterers, and verified community recovery partners before quality food goes to waste.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-950/80 text-[#E7A85B] border border-[#E7A85B]/30">
                <ShieldCheck className="w-4 h-4 text-[#E7A85B]" />
                Hackathon Prototype • Live Operational Pipeline
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E7A85B]">Platform</h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <Link to="/listings" className="hover:text-white transition-colors flex items-center gap-1">
                  Discover Surplus Food <ArrowUpRight className="w-3 h-3 text-[#E7A85B]" />
                </Link>
              </li>
              <li>
                <Link to="/listings/create" className="hover:text-white transition-colors flex items-center gap-1">
                  Donate Surplus Food <ArrowUpRight className="w-3 h-3 text-[#E7A85B]" />
                </Link>
              </li>
              <li>
                <Link to="/impact" className="hover:text-white transition-colors flex items-center gap-1">
                  Verified Impact Metrics <ArrowUpRight className="w-3 h-3 text-[#E7A85B]" />
                </Link>
              </li>
              <li>
                <Link to="/food-safety" className="hover:text-white transition-colors flex items-center gap-1">
                  Food Safety Guidelines <ArrowUpRight className="w-3 h-3 text-[#E7A85B]" />
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors flex items-center gap-1">
                  Sign In / Demo Accounts <ArrowUpRight className="w-3 h-3 text-[#E7A85B]" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Food Safety & Trust */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E7A85B]">
              Safety Boundary &amp; Disclosures
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              BhojanSetu coordinates recovery logistics and eligible partner routing; it does not
              independently certify food as safe.
            </p>
            <p className="text-xs text-stone-300 leading-relaxed">
              All collections enforce strict time-window validity, verified partner capacities, and mandatory
              on-site temperature inspection (&gt;60°C hot, &lt;5°C chilled) prior to final distribution.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <div>
            &copy; {new Date().getFullYear()} BhojanSetu. Designed for responsible food stewardship.
          </div>
          <div className="flex items-center gap-5">
            <Link to="/food-safety" className="hover:text-white transition-colors">
              Handling Protocols
            </Link>
            <span>•</span>
            <span className="text-[#E7A85B] flex items-center gap-1.5 font-medium">
              <HeartHandshake className="w-4 h-4" /> Community-Powered Food Rescue
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
