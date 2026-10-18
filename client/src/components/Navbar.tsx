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
  ClipboardList,
  CheckCircle,
  LayoutDashboard,
  ArrowRight,
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
    `text-xs sm:text-sm font-medium tracking-tight transition-all px-3 py-1.5 rounded-lg ${
      isActive
        ? 'text-[#174D3A] bg-[#DDE8D8]/60 font-semibold'
        : 'text-[#68736A] hover:text-[#174D3A] hover:bg-[#DDE8D8]/30'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-[#F7F4EC]/90 backdrop-blur-md border-b border-[#174D3A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Mark & Wordmark */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#174D3A] rounded-xl p-1">
            <div className="w-10 h-10 rounded-xl bg-[#174D3A] text-white flex items-center justify-center shadow-sm group-hover:bg-[#237653] transition-colors">
              <UtensilsCrossed className="w-5 h-5 text-[#E7A85B]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold font-serif text-[#174D3A] tracking-tight leading-none">
                Bhojan<span className="text-[#E7A85B]">Setu</span>
              </span>
              <span className="text-[11px] text-[#68736A] font-medium tracking-wide">
                Surplus Food Recovery Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
            <NavLink to="/listings" className={navLinkClasses}>
              <span className="flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" /> Discover Food
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
              className="text-xs sm:text-sm font-medium tracking-tight text-[#68736A] hover:text-[#174D3A] hover:bg-[#DDE8D8]/30 px-3 py-1.5 rounded-lg transition-all"
            >
              How It Works
            </a>
            <NavLink to="/impact" className={navLinkClasses}>
              <span className="flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5" /> Our Impact
              </span>
            </NavLink>
            <NavLink to="/food-safety" className={navLinkClasses}>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Food Safety
              </span>
            </NavLink>

            {user && (
              <NavLink to="/dashboard" className={navLinkClasses}>
                <span className="flex items-center gap-1.5">
                  <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                </span>
              </NavLink>
            )}
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-[#202820] leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-[#68736A] capitalize flex items-center justify-end gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#237653]" />
                    {user.role} {user.role === 'partner' && `(${user.verificationStatus})`}
                  </span>
                </div>

                <Link
                  to="/listings/create"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl text-white bg-[#174D3A] hover:bg-[#237653] shadow-xs transition-all hover:scale-[1.02]"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#E7A85B]" />
                  Donate Surplus Food
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 text-[#68736A] hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
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
                  className="px-3.5 py-2 text-xs font-semibold text-[#174D3A] hover:bg-[#DDE8D8]/50 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/listings/create"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-white bg-[#174D3A] hover:bg-[#237653] shadow-sm hover:shadow-md transition-all hover:scale-[1.02]"
                >
                  Donate Surplus Food
                  <ArrowRight className="w-3.5 h-3.5 text-[#E7A85B]" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#174D3A] hover:bg-[#DDE8D8]/50 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#174D3A]/10 bg-[#F7F4EC] px-4 pt-4 pb-6 space-y-3 animate-slide-up">
          {user && (
            <div className="p-3 bg-white rounded-xl border border-[#174D3A]/10 flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm text-[#202820]">{user.name}</div>
                <div className="text-xs text-[#237653] capitalize font-medium">
                  {user.role} • Status: {user.verificationStatus}
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs text-rose-700 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-rose-50"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign out
              </button>
            </div>
          )}

          <div className="space-y-1">
            <Link
              to="/listings"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-[#202820] hover:bg-[#DDE8D8]/50"
            >
              Discover Food
            </Link>
            <a
              href="/#how-it-works"
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-[#202820] hover:bg-[#DDE8D8]/50"
            >
              How It Works
            </a>
            <Link
              to="/impact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-[#202820] hover:bg-[#DDE8D8]/50"
            >
              Our Impact
            </Link>
            <Link
              to="/food-safety"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-[#202820] hover:bg-[#DDE8D8]/50"
            >
              Food Safety Guidelines
            </Link>

            {user && (
              <>
                <div className="pt-2 border-t border-[#174D3A]/10 font-bold text-[10px] text-[#68736A] px-3 uppercase tracking-wider">
                  Workspace
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-[#202820] hover:bg-[#DDE8D8]/50"
                >
                  Dashboard
                </Link>

                {user.role === 'organizer' && (
                  <Link
                    to="/listings/create"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#174D3A] bg-[#DDE8D8]/60"
                  >
                    + Donate Surplus Food
                  </Link>
                )}

                {user.role === 'partner' && (
                  <>
                    <Link
                      to="/requests"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-sm font-medium text-[#202820] hover:bg-[#DDE8D8]/50"
                    >
                      My Pickups & Requests
                    </Link>
                    <Link
                      to="/partner/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-sm font-medium text-[#202820] hover:bg-[#DDE8D8]/50"
                    >
                      Partner Verification Status
                    </Link>
                  </>
                )}

                {user.role === 'admin' && (
                  <Link
                    to="/admin/partners"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-purple-900 bg-purple-50"
                  >
                    Admin Partner Review
                  </Link>
                )}
              </>
            )}
          </div>

          <div className="pt-3 border-t border-[#174D3A]/10 flex flex-col gap-2">
            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold text-[#174D3A] bg-white border border-[#174D3A]/20 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/listings/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold text-white bg-[#174D3A] rounded-xl shadow-xs"
                >
                  Donate Surplus Food
                </Link>
              </>
            ) : (
              <Link
                to="/listings/create"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-white bg-[#174D3A] rounded-xl shadow-xs"
              >
                Donate Surplus Food
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
