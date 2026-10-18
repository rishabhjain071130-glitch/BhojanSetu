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
  MapPin,
  Clock,
  Flame,
  ArrowRight,
  X,
  SlidersHorizontal,
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

  // Instant client-side filtering and sorting
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
      {/* 1. LIGHT, SPACIOUS PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#202820] tracking-tight">
            Find food to rescue
          </h1>
          <p className="text-xs sm:text-sm text-[#667067]">
            Discover available surplus food and coordinate a verified recovery pickup.
          </p>
        </div>
        <div className="text-xs sm:text-sm font-semibold text-[#202820]">
          {loading ? (
            <span className="text-[#667067]">Searching...</span>
          ) : (
            <>
              <span className="text-[#287653] font-bold">{filteredListings.length}</span>{' '}
              {filteredListings.length === 1 ? 'listing' : 'listings'} available
            </>
          )}
        </div>
      </div>

      {/* 2 & 3. PROMINENT SEARCH FIELD & COMPACT FILTER ROW */}
      <div className="card-light p-4 sm:p-5 space-y-3.5 bg-white border border-[#E7E8E1] shadow-2xs">
        {/* Prominent Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#667067] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search food, event or location…"
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-[#E7E8E1] rounded-xl bg-[#FAF9F6] text-[#202820] placeholder:text-[#667067] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#287653] focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-[#667067] hover:text-[#202820]"
                aria-label="Clear search"
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
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#287653]" />
          </button>
        </form>

        {/* Compact Filter Row */}
        <div className={`${mobileFiltersOpen ? 'flex' : 'hidden'} sm:flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E7E8E1] text-xs`}>
          <div className="flex flex-wrap items-center gap-2">
            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-1.5 border border-[#E7E8E1] rounded-xl bg-white text-[#202820] text-xs focus:ring-1 focus:ring-[#287653] focus:outline-hidden"
            >
              <option value="all">All Food Types</option>
              <option value="cooked_meals">Cooked Meals</option>
              <option value="packaged_ration">Packaged Rations</option>
              <option value="bakery">Bakery &amp; Bread</option>
              <option value="desserts">Desserts / Sweets</option>
              <option value="fruits_vegetables">Fruits &amp; Vegetables</option>
            </select>

            {/* Availability */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-1.5 border border-[#E7E8E1] rounded-xl bg-white text-[#202820] text-xs focus:ring-1 focus:ring-[#287653] focus:outline-hidden"
            >
              <option value="all">All Availability</option>
              <option value="open">Open Only</option>
              <option value="assigned">Assigned / In Transit</option>
            </select>

            {/* Urgent only */}
            <button
              type="button"
              onClick={() => setUrgentOnly(!urgentOnly)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                urgentOnly
                  ? 'bg-[#FEF3C7] border-[#E9AE62] text-[#92400E]'
                  : 'border-[#E7E8E1] bg-white text-[#667067] hover:bg-[#F0F4EE]'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${urgentOnly ? 'text-[#D97706]' : 'text-[#667067]'}`} />
              Urgent (&lt;4h window)
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-bold text-[#287653] hover:underline px-2 py-1"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* 4. SIMPLE SORT CONTROL */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-[#667067]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 border border-[#E7E8E1] rounded-xl bg-white text-[#202820] text-xs focus:ring-1 focus:ring-[#287653] focus:outline-hidden"
            >
              <option value="deadline">Nearest deadline first</option>
              <option value="quantity">Largest quantity first</option>
            </select>
          </div>
        </div>
      </div>

      {error && <ErrorAlert message={error} onRetry={fetchListings} />}

      {/* 5. CLEAN LISTING CARDS ARRANGED IN RESPONSIVE GRID */}
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
              className="card-light p-5 sm:p-6 flex flex-col justify-between hover:shadow-md transition-all duration-200 bg-white border border-[#E7E8E1] rounded-2xl"
            >
              <div className="space-y-3.5">
                {/* Event type & Collection deadline window */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#287653] bg-[#DDEBDD] px-2.5 py-0.5 rounded-full border border-[#287653]/15">
                    {listing.eventType}
                  </span>
                  <UrgencyBadge deadline={listing.collectionDeadline} />
                </div>

                {/* Food Name */}
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-[#202820] font-serif line-clamp-1">
                    {listing.foodTitle}
                  </h3>
                  <p className="text-xs text-[#667067] truncate mt-0.5">
                    {listing.eventName}
                  </p>
                </div>

                {/* Available Quantity & Locality */}
                <div className="space-y-2 pt-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#667067]">Available Amount:</span>
                    <span className="font-bold text-[#287653] text-sm">
                      {listing.quantity} {listing.unit}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[#667067]">
                    <span>Locality:</span>
                    <span className="font-medium text-[#202820] flex items-center gap-1 max-w-[180px] truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#287653] shrink-0" />
                      {listing.areaOrAddress}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Badge & Obvious "View Details" Action */}
              <div className="mt-5 pt-4 border-t border-[#E7E8E1] flex items-center justify-between">
                <StatusBadge status={listing.status} size="sm" />

                <Link
                  to={`/listings/${listing._id}`}
                  className="btn-primary-brand text-xs py-1.5 px-3.5"
                >
                  View details <ArrowRight className="w-3.5 h-3.5 text-[#DDEBDD]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default BrowseListingsPage;
