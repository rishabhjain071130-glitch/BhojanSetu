import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { request } from '../api/client.js';
import { FoodListing } from '../types/index.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { UrgencyBadge } from '../components/UrgencyBadge.js';
import { LoadingSpinner } from '../components/LoadingSpinner.js';
import { EmptyState } from '../components/EmptyState.js';
import { ErrorAlert } from '../components/ErrorAlert.js';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Flame,
  ArrowRight,
  X,
  SlidersHorizontal,
  ChevronDown,
  UtensilsCrossed,
  PackageOpen,
} from 'lucide-react';

export const BrowseListingsPage: React.FC = () => {
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'deadline' | 'quantity'>('deadline');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    fetchListings();
  }, [category, status, urgentOnly]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (category !== 'all') params.append('category', category);
      if (status !== 'all') params.append('status', status);
      if (searchQuery.trim()) params.append('area', searchQuery.trim());
      if (urgentOnly) params.append('urgentOnly', 'true');

      const data = await request<{ listings: FoodListing[] }>(`/listings?${params.toString()}`);
      setListings(data.listings || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch surplus listings.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchListings();
  };

  const clearAllFilters = () => {
    setCategory('all');
    setStatus('all');
    setUrgentOnly(false);
    setSearchQuery('');
  };

  // Client-side text filter and sorting for instant responsiveness
  const filteredListings = useMemo(() => {
    let result = [...listings];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.foodTitle.toLowerCase().includes(q) ||
          item.eventName.toLowerCase().includes(q) ||
          item.areaOrAddress.toLowerCase().includes(q) ||
          item.foodCategory.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'deadline') {
      result.sort((a, b) => new Date(a.collectionDeadline).getTime() - new Date(b.collectionDeadline).getTime());
    } else if (sortBy === 'quantity') {
      result.sort((a, b) => b.quantity - a.quantity);
    }

    return result;
  }, [listings, searchQuery, sortBy]);

  const hasActiveFilters = category !== 'all' || status !== 'all' || urgentOnly || searchQuery.trim() !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 animate-fade-in">
      {/* A. SIMPLE, STREAMLINED HEADER */}
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#18372D] tracking-tight">
          Find food to rescue
        </h1>
        <p className="text-xs sm:text-sm text-[#66756B]">
          Discover available surplus food and coordinate a safe pickup.
        </p>
      </div>

      {/* B. ONE CLEAR SEARCH AREA */}
      <div className="card-light p-4 sm:p-5 space-y-4">
        {/* Main Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#66756B] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by food, event, or locality..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-[#E3E8E0] rounded-xl bg-[#F8F7F2] text-[#18372D] placeholder:text-[#66756B] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2D8061] focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-[#66756B] hover:text-[#18372D]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary-brand text-xs sm:text-sm py-2 px-5 shrink-0"
          >
            Search
          </button>

          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="sm:hidden btn-outline px-3 py-2 text-xs flex items-center gap-1.5"
            aria-label="Toggle filters"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#2D8061]" />
          </button>
        </form>

        {/* Compact Filter Row (Desktop & Tablet) */}
        <div className={`${mobileFiltersOpen ? 'flex' : 'hidden'} sm:flex flex-wrap items-center gap-2 pt-2 border-t border-[#E3E8E0] text-xs`}>
          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-1.5 border border-[#E3E8E0] rounded-xl bg-white text-[#18372D] text-xs focus:ring-1 focus:ring-[#2D8061] focus:outline-hidden"
          >
            <option value="all">All Food Types</option>
            <option value="cooked_meals">Cooked Meals</option>
            <option value="packaged_ration">Packaged Rations</option>
            <option value="bakery">Bakery &amp; Bread</option>
            <option value="desserts">Desserts / Sweets</option>
            <option value="fruits_vegetables">Fruits &amp; Vegetables</option>
          </select>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-1.5 border border-[#E3E8E0] rounded-xl bg-white text-[#18372D] text-xs focus:ring-1 focus:ring-[#2D8061] focus:outline-hidden"
          >
            <option value="all">All Availability</option>
            <option value="open">Open Only</option>
            <option value="assigned">Assigned / In Transit</option>
          </select>

          {/* Urgent Toggle Chip */}
          <button
            type="button"
            onClick={() => setUrgentOnly(!urgentOnly)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              urgentOnly
                ? 'bg-[#FEF3C7] border-[#E9B76A] text-[#92400E]'
                : 'border-[#E3E8E0] bg-white text-[#66756B] hover:bg-[#EEF4ED]'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${urgentOnly ? 'text-[#D97706]' : 'text-[#66756B]'}`} />
            Urgent (&lt;4h window)
          </button>

          {/* Active Filter Chips & Clear Action */}
          {hasActiveFilters && (
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-bold text-[#174C3C] hover:text-[#2D8061] hover:underline px-2 py-1"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* C. COMPACT RESULT SUMMARY & SORTING */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-[#66756B]">
        <div className="font-semibold text-[#18372D]">
          {loading ? (
            'Searching listings...'
          ) : (
            <>
              <span className="text-[#174C3C] font-bold">{filteredListings.length}</span>{' '}
              {filteredListings.length === 1 ? 'food listing' : 'food listings'} available
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#66756B] hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1 border border-[#E3E8E0] rounded-xl bg-white text-[#18372D] text-xs focus:ring-1 focus:ring-[#2D8061] focus:outline-hidden"
          >
            <option value="deadline">Nearest deadline first</option>
            <option value="quantity">Highest quantity first</option>
          </select>
        </div>
      </div>

      {error && <ErrorAlert message={error} onRetry={fetchListings} />}

      {/* D. BEAUTIFUL, SIMPLIFIED FOOD LISTING CARDS */}
      {loading ? (
        <LoadingSpinner message="Loading surplus opportunities..." size="lg" />
      ) : filteredListings.length === 0 ? (
        <EmptyState
          title="No food listings found"
          description="Try broadening your search term or clearing active filters to see available surplus."
          actionText="Clear All Filters"
          onAction={clearAllFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <div
              key={listing._id}
              className="card-light p-5 sm:p-6 flex flex-col justify-between hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-4">
                {/* Header row: Category Pill + Urgency Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#174C3C] bg-[#DCEFE2] px-2.5 py-0.5 rounded-full border border-[#174C3C]/10">
                    {listing.eventType}
                  </span>
                  <UrgencyBadge deadline={listing.collectionDeadline} />
                </div>

                {/* 1. What Food is available? */}
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-[#18372D] font-serif line-clamp-1">
                    {listing.foodTitle}
                  </h3>
                  <p className="text-xs text-[#66756B] truncate mt-0.5">
                    {listing.eventName}
                  </p>
                </div>

                {/* 2 & 3. Quantity & Approximate Location */}
                <div className="space-y-2 pt-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#66756B]">Available Amount:</span>
                    <span className="font-bold text-[#174C3C] text-sm">
                      {listing.quantity} {listing.unit}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[#66756B]">
                    <span>Pickup Area:</span>
                    <span className="font-medium text-[#18372D] flex items-center gap-1 max-w-[180px] truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#2D8061] shrink-0" />
                      {listing.areaOrAddress}
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 & 5. Status Badge & Direct CTA */}
              <div className="mt-5 pt-4 border-t border-[#E3E8E0] flex items-center justify-between">
                <StatusBadge status={listing.status} size="sm" />

                <Link
                  to={`/listings/${listing._id}`}
                  className="btn-primary-brand text-xs py-1.5 px-3.5"
                >
                  View details <ArrowRight className="w-3.5 h-3.5 text-[#DCEFE2]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
