import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import {
  UtensilsCrossed,
  Menu,
  X,
  LogOut,
  PlusCircle,
  Search,
  BarChart3,
  ShieldCheck,
  LayoutDashboard,
  ArrowRight,
  ClipboardList,
  Users,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `text-xs sm:text-sm font-medium tracking-tight transition-all px-3 py-1.5 rounded-xl ${
      isActive
        ? 'text-[#174C3C] bg-[#DCEFE2] font-semibold border border-[#174C3C]/10 shadow-2xs'
        : 'text-[#66756B] hover:text-[#18372D] hover:bg-[#EEF4ED]'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-[#F8F7F2]/95 backdrop-blur-md border-b border-[#E3E8E0] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Mark & Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-hidden focus:ring-2 focus:ring-[#174C3C] rounded-xl p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-[#174C3C] text-[#DCEFE2] flex items-center justify-center shadow-xs group-hover:bg-[#2D8061] transition-colors">
              <UtensilsCrossed className="w-5 h-5 text-[#DCEFE2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold font-serif text-[#18372D] tracking-tight leading-none">
                Bhojan<span className="text-[#2D8061]">Setu</span>
              </span>
              <span className="text-[11px] text-[#66756B] font-medium tracking-wide">
                Food Recovery Network
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
            <NavLink to="/listings" className={navLinkClasses}>
              <span className="flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-[#2D8061]" /> Discover Food
              </span>
            </NavLink>
            <a
              href="/#how-it-works"
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-xs sm:text-sm font-medium tracking-tight text-[#66756B] hover:text-[#18372D] hover:bg-[#EEF4ED] px-3 py-1.5 rounded-xl transition-all"
            >
              How It Works
            </a>
            <NavLink to="/impact" className={navLinkClasses}>
              <span className="flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-[#2D8061]" /> Our Impact
              </span>
            </NavLink>
            <NavLink to="/food-safety" className={navLinkClasses}>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2D8061]" /> Food Safety
              </span>
            </NavLink>

            {user && (
              <>
                <NavLink to="/dashboard" className={navLinkClasses}>
                  <span className="flex items-center gap-1.5">
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#2D8061]" /> Dashboard
                  </span>
                </NavLink>
                {user.role === 'partner' && (
                  <NavLink to="/requests" className={navLinkClasses}>
                    <span className="flex items-center gap-1.5">
                      <ClipboardList className="w-3.5 h-3.5 text-[#2D8061]" /> My Pickups
                    </span>
                  </NavLink>
                )}
                {user.role === 'admin' && (
                  <NavLink to="/admin/partners" className={navLinkClasses}>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#2D8061]" /> Partners
                    </span>
                  </NavLink>
                )}
              </>
            )}
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-[#18372D] leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-[#66756B] capitalize flex items-center justify-end gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2D8061]" />
                    {user.role} {user.role === 'partner' && `(${user.verificationStatus})`}
                  </span>
                </div>

                {user.role === 'organizer' || user.role === 'admin' ? (
                  <Link
                    to="/listings/create"
                    className="btn-primary-brand text-xs py-2 px-3.5 shadow-xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-[#DCEFE2]" />
                    Donate Food
                  </Link>
                ) : (
                  <Link
                    to="/listings"
                    className="btn-primary-brand text-xs py-2 px-3.5 shadow-xs"
                  >
                    <Search className="w-3.5 h-3.5 text-[#DCEFE2]" />
                    Rescue Food
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 text-[#66756B] hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-[#18372D] hover:bg-[#EEF4ED] rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/listings"
                  className="px-3.5 py-2 text-xs font-semibold text-[#2D8061] hover:bg-[#EEF4ED] rounded-xl transition-colors"
                >
                  Rescue Food
                </Link>
                <Link
                  to="/listings/create"
                  className="btn-primary-brand text-xs py-2 px-4 shadow-xs"
                >
                  Donate Food
                  <ArrowRight className="w-3.5 h-3.5 text-[#DCEFE2]" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#18372D] hover:bg-[#EEF4ED] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-[#174C3C]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E3E8E0] bg-[#F8F7F2] px-4 pt-3 pb-6 space-y-2 animate-fade-in shadow-xl">
          <NavLink
            to="/listings"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#18372D] hover:bg-[#EEF4ED]"
          >
            <Search className="w-4 h-4 text-[#2D8061]" /> Discover Surplus Food
          </NavLink>
          <a
            href="/#how-it-works"
            onClick={(e) => {
              setMobileMenuOpen(false);
              if (location.pathname === '/') {
                e.preventDefault();
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#18372D] hover:bg-[#EEF4ED]"
          >
            How It Works
          </a>
          <NavLink
            to="/impact"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#18372D] hover:bg-[#EEF4ED]"
          >
            <BarChart3 className="w-4 h-4 text-[#2D8061]" /> Impact Dashboard
          </NavLink>
          <NavLink
            to="/food-safety"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#18372D] hover:bg-[#EEF4ED]"
          >
            <ShieldCheck className="w-4 h-4 text-[#2D8061]" /> Food Safety Standards
          </NavLink>

          {user ? (
            <div className="pt-3 border-t border-[#E3E8E0] space-y-2">
              <NavLink
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#18372D] hover:bg-[#EEF4ED]"
              >
                <LayoutDashboard className="w-4 h-4 text-[#2D8061]" /> My Dashboard ({user.role})
              </NavLink>

              {user.role === 'partner' && (
                <NavLink
                  to="/requests"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#18372D] hover:bg-[#EEF4ED]"
                >
                  <ClipboardList className="w-4 h-4 text-[#2D8061]" /> Rescue Requests &amp; Pickups
                </NavLink>
              )}

              {user.role === 'admin' && (
                <NavLink
                  to="/admin/partners"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#18372D] hover:bg-[#EEF4ED]"
                >
                  <Users className="w-4 h-4 text-[#2D8061]" /> Partner Verification Console
                </NavLink>
              )}

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-[#66756B]">Logged in as <strong>{user.name}</strong></span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs font-semibold text-rose-700 hover:underline flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-3 border-t border-[#E3E8E0] grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 text-xs font-bold text-[#174C3C] bg-[#DCEFE2] rounded-xl border border-[#174C3C]/15"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 text-xs font-bold text-white bg-[#174C3C] hover:bg-[#2D8061] rounded-xl shadow-xs"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
