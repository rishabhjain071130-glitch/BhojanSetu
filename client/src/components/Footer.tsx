import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ShieldCheck, HeartHandshake, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#174C3C] text-[#DCEFE2] mt-24 border-t border-[#174C3C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#2D8061]/30">
          {/* Brand & mission */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2D8061] text-[#DCEFE2] flex items-center justify-center font-bold shadow-xs">
                <UtensilsCrossed className="w-5 h-5 text-[#DCEFE2]" />
              </div>
              <span className="text-2xl font-bold font-serif text-[#FFFFFF] tracking-tight">
                Bhojan<span className="text-[#DCEFE2]">Setu</span>
              </span>
            </div>
            <p className="font-serif italic text-[#DCEFE2] text-lg">
              "Good food deserves a destination, not a dustbin."
            </p>
            <p className="text-xs text-[#DCEFE2]/80 max-w-sm leading-relaxed">
              An event-based surplus-food recovery and redistribution platform connecting event organizers,
              caterers, and verified community recovery partners before quality food goes to waste.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#2D8061]/40 text-[#FFFFFF] border border-[#DCEFE2]/20 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#DCEFE2]" />
                Hackathon Prototype • Live Operational Pipeline
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">Platform</h4>
            <ul className="space-y-2 text-xs text-[#DCEFE2]/80">
              <li>
                <Link to="/listings" className="hover:text-white transition-colors flex items-center gap-1">
                  Discover Surplus Food <ArrowUpRight className="w-3 h-3 text-[#DCEFE2]" />
                </Link>
              </li>
              <li>
                <Link to="/listings/create" className="hover:text-white transition-colors flex items-center gap-1">
                  Donate Surplus Food <ArrowUpRight className="w-3 h-3 text-[#DCEFE2]" />
                </Link>
              </li>
              <li>
                <Link to="/impact" className="hover:text-white transition-colors flex items-center gap-1">
                  Verified Impact Metrics <ArrowUpRight className="w-3 h-3 text-[#DCEFE2]" />
                </Link>
              </li>
              <li>
                <Link to="/food-safety" className="hover:text-white transition-colors flex items-center gap-1">
                  Food Safety Guidelines <ArrowUpRight className="w-3 h-3 text-[#DCEFE2]" />
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors flex items-center gap-1">
                  Sign In / Demo Roles <ArrowUpRight className="w-3 h-3 text-[#DCEFE2]" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Food Safety & Trust */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
              Safety Boundary &amp; Protocols
            </h4>
            <p className="text-xs text-[#DCEFE2]/80 leading-relaxed">
              BhojanSetu coordinates recovery logistics and eligible partner routing; it does not
              independently certify food as safe.
            </p>
            <p className="text-xs text-[#DCEFE2]/80 leading-relaxed">
              All collections enforce strict time-window validity, verified partner capacities, and mandatory
              on-site temperature inspection (&gt;60°C hot, &lt;5°C chilled) prior to final community distribution.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#DCEFE2]/80 gap-4">
          <div>
            &copy; {new Date().getFullYear()} BhojanSetu. Designed for responsible food recovery.
          </div>
          <div className="flex items-center gap-5">
            <Link to="/food-safety" className="hover:text-white transition-colors">
              Safety Architecture
            </Link>
            <span>•</span>
            <span className="text-[#FFFFFF] flex items-center gap-1.5 font-medium">
              <HeartHandshake className="w-4 h-4 text-[#DCEFE2]" /> Community-Powered Food Rescue
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
