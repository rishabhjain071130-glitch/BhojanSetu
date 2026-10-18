import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import {
  UtensilsCrossed,
  Menu,
  X,
  LogOut,
  User as UserIcon,
  PlusCircle,
  Search,
  BarChart3,
  ShieldCheck,
  ClipboardList,
  CheckCircle,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `text-xs sm:text-sm font-medium transition-colors px-3 py-1.5 rounded-lg ${
      isActive
        ? 'text-emerald-950 bg-emerald-50 font-semibold'
        : 'text-gray-600 hover:text-emerald-900 hover:bg-emerald-50/50'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs group-hover:bg-emerald-900 transition-colors">
              <UtensilsCrossed className="w-5 h-5 text-emerald-200" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-gray-950 font-serif leading-none">
                Bhojan<span className="text-emerald-800">Setu</span>
              </span>
              <span className="text-[10px] text-gray-500 font-medium tracking-wide">
                Surplus Food Recovery Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/listings" className={navLinkClasses}>
              <span className="flex items-center gap-1.5">
                <Search className="w-4 h-4" /> Browse Surplus
              </span>
            </NavLink>
            <NavLink to="/impact" className={navLinkClasses}>
              <span className="flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4" /> Verified Impact
              </span>
            </NavLink>
            <NavLink to="/food-safety" className={navLinkClasses}>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Food Safety Rules
              </span>
            </NavLink>

            {user && (
              <>
                <NavLink to="/dashboard" className={navLinkClasses}>
                  Dashboard
                </NavLink>

                {user.role === 'organizer' && (
                  <NavLink to="/listings/create" className={navLinkClasses}>
                    <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                      <PlusCircle className="w-4 h-4" /> List Food
                    </span>
                  </NavLink>
                )}

                {user.role === 'partner' && (
                  <>
                    <NavLink to="/requests" className={navLinkClasses}>
                      <span className="flex items-center gap-1.5">
                        <ClipboardList className="w-4 h-4" /> My Pickups
                      </span>
                    </NavLink>
                    <NavLink to="/partner/profile" className={navLinkClasses}>
                      Verification
                    </NavLink>
                  </>
                )}

                {user.role === 'admin' && (
                  <NavLink to="/admin/partners" className={navLinkClasses}>
                    <span className="flex items-center gap-1.5 text-purple-800 font-semibold">
                      <CheckCircle className="w-4 h-4" /> Admin Verifications
                    </span>
                  </NavLink>
                )}
              </>
            )}
          </nav>

          {/* User Status / Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-gray-900 leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-gray-500 capitalize flex items-center justify-end gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    {user.role} {user.role === 'partner' && `(${user.verificationStatus})`}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-medium text-gray-700 hover:text-emerald-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg text-white bg-emerald-800 hover:bg-emerald-900 shadow-xs transition-colors"
                >
                  Join as Partner / Organizer
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {user && (
            <div className="p-3 bg-emerald-50/70 rounded-xl mb-3 flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm text-emerald-950">{user.name}</div>
                <div className="text-xs text-emerald-800 capitalize">
                  {user.role} • Status: {user.verificationStatus}
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs text-rose-700 font-semibold flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" /> Log out
              </button>
            </div>
          )}

          <div className="space-y-1">
            <Link
              to="/listings"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-emerald-50"
            >
              Browse Surplus Listings
            </Link>
            <Link
              to="/impact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-emerald-50"
            >
              Verified Impact Dashboard
            </Link>
            <Link
              to="/food-safety"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-emerald-50"
            >
              Food Safety & Handling Rules
            </Link>

            {user && (
              <>
                <div className="pt-2 border-t border-gray-100 font-semibold text-xs text-gray-400 px-3 uppercase tracking-wider">
                  My Workflow
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-emerald-50"
                >
                  Dashboard
                </Link>

                {user.role === 'organizer' && (
                  <Link
                    to="/listings/create"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
                  >
                    + List Surplus Food
                  </Link>
                )}

                {user.role === 'partner' && (
                  <>
                    <Link
                      to="/requests"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-emerald-50"
                    >
                      My Requests & Pickups
                    </Link>
                    <Link
                      to="/partner/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-emerald-50"
                    >
                      Partner Profile & Verification
                    </Link>
                  </>
                )}

                {user.role === 'admin' && (
                  <Link
                    to="/admin/partners"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-semibold text-purple-800 hover:bg-purple-50"
                  >
                    Admin Verification Console
                  </Link>
                )}
              </>
            )}
          </div>

          {!user && (
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-semibold text-white bg-emerald-800 rounded-lg shadow-xs"
              >
                Join as Partner / Organizer
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
