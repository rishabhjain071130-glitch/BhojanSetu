import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { request } from '../api/client.js';
import { FoodListing } from '../types/index.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { UrgencyBadge } from '../components/UrgencyBadge.js';
import { LoadingSpinner } from '../components/LoadingSpinner.js';
import { EmptyState } from '../components/EmptyState.js';
import { ErrorAlert } from '../components/ErrorAlert.js';
import { FoodSafetyBanner } from '../components/FoodSafetyBanner.js';
import {
  Search,
  Filter,
  Clock,
  MapPin,
  Utensils,
  ArrowRight,
  Flame,
  Building2,
  Calendar,
} from 'lucide-react';

export const BrowseListingsPage: React.FC = () => {
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [category, setCategory] = useState('all');
  const [eventType, setEventType] = useState('all');
  const [status, setStatus] = useState('all');
  const [area, setArea] = useState('');
  const [urgentOnly, setUrgentOnly] = useState(false);

  useEffect(() => {
    fetchListings();
  }, [category, eventType, status, urgentOnly]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (category !== 'all') params.append('category', category);
      if (eventType !== 'all') params.append('eventType', eventType);
      if (status !== 'all') params.append('status', status);
      if (area.trim()) params.append('area', area.trim());
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Editorial Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#174D3A]">
          <span className="w-2 h-2 rounded-full bg-[#237653]" />
          Surplus Discovery Hub
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#202820] tracking-tight">
          Browse Eligible Event Surplus Food
        </h1>
        <p className="text-xs sm:text-sm text-[#68736A] max-w-2xl leading-relaxed">
          Discover non-expired surplus batches from weddings, corporate banquets, and caterers.
          Review handling conditions and claim with verified recovery partner credentials.
        </p>
      </div>

      <FoodSafetyBanner compact />

      {/* Filter and Search Bar */}
      <div className="card-editorial p-5 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Filter by locality or area (e.g. Saket, Connaught Place, Gurugram)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-stone-200 rounded-xl bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#174D3A] focus:border-transparent transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#174D3A] hover:bg-[#237653] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs shrink-0"
          >
            Search Locality
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-stone-100 text-xs">
          <div className="flex items-center gap-1.5 text-[#68736A] font-semibold">
            <Filter className="w-3.5 h-3.5 text-[#174D3A]" /> Filters:
          </div>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-1.5 border border-stone-200 rounded-xl bg-white text-[#202820] focus:outline-none focus:ring-1 focus:ring-[#174D3A]"
          >
            <option value="all">All Food Categories</option>
            <option value="cooked_meals">Cooked Meals</option>
            <option value="packaged_ration">Packaged Rations</option>
            <option value="bakery">Bakery / Bread</option>
            <option value="desserts">Desserts / Sweets</option>
            <option value="fruits_vegetables">Fruits &amp; Vegetables</option>
            <option value="beverages">Beverages</option>
            <option value="other">Other</option>
          </select>

          {/* Event Type Filter */}
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="px-3 py-1.5 border border-stone-200 rounded-xl bg-white text-[#202820] focus:outline-none focus:ring-1 focus:ring-[#174D3A]"
          >
            <option value="all">All Event Types</option>
            <option value="wedding">Weddings</option>
            <option value="banquet">Banquets</option>
            <option value="catering">Catering</option>
            <option value="college">College Festivals</option>
            <option value="community">Community Gatherings</option>
            <option value="other">Other Events</option>
          </select>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-1.5 border border-stone-200 rounded-xl bg-white text-[#202820] focus:outline-none focus:ring-1 focus:ring-[#174D3A]"
          >
            <option value="all">Open &amp; Requested</option>
            <option value="open">Open Only</option>
            <option value="assigned">Assigned / In Progress</option>
            <option value="delivered">Delivered Rescues</option>
          </select>

          {/* Urgent Toggle */}
          <button
            type="button"
            onClick={() => setUrgentOnly(!urgentOnly)}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-medium transition-all ${
              urgentOnly
                ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                : 'border-stone-200 text-[#68736A] hover:bg-stone-50'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${urgentOnly ? 'text-amber-600' : 'text-stone-400'}`} />
            Urgent (&lt;4h window)
          </button>
        </div>
      </div>

      {error && <ErrorAlert message={error} onRetry={fetchListings} />}

      {/* Listings Grid */}
      {loading ? (
        <LoadingSpinner message="Searching persistent food listings..." size="lg" />
      ) : listings.length === 0 ? (
        <EmptyState
          title="No surplus listings found"
          description="Try broadening your locality or category filter, or check back shortly as events conclude."
          actionText="Reset All Filters"
          onAction={() => {
            setCategory('all');
            setEventType('all');
            setStatus('all');
            setArea('');
            setUrgentOnly(false);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => {
            return (
              <div
                key={listing._id}
                className="card-editorial p-6 flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#174D3A] bg-[#DDE8D8]/70 px-2.5 py-0.5 rounded-full border border-[#174D3A]/10">
                      {listing.eventType}
                    </span>
                    <UrgencyBadge deadline={listing.collectionDeadline} />
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-[#202820] font-serif line-clamp-1">
                      {listing.foodTitle}
                    </h3>
                    <p className="text-xs text-[#68736A] font-medium truncate mt-0.5">
                      Event: {listing.eventName}
                    </p>
                  </div>

                  <p className="text-xs text-[#68736A] line-clamp-2 leading-relaxed">
                    {listing.description}
                  </p>

                  <div className="p-3 bg-stone-50 rounded-xl space-y-1.5 text-xs text-[#202820] border border-stone-200/60">
                    <div className="flex justify-between items-center">
                      <span className="text-[#68736A]">Surplus Volume:</span>
                      <strong className="text-[#174D3A] text-sm">
                        {listing.quantity} {listing.unit}
                      </strong>
                    </div>

                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-[#68736A]">Holding Temp:</span>
                      <span className="font-medium truncate max-w-[170px]" title={listing.storageConditions}>
                        {listing.storageConditions}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-[#68736A]">
                      <span>Locality:</span>
                      <span className="font-medium text-[#202820] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#174D3A]" />
                        {listing.areaOrAddress}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between">
                  <StatusBadge status={listing.status} size="sm" />

                  <Link
                    to={`/listings/${listing._id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#174D3A] hover:text-[#237653] group"
                  >
                    View Details &amp; Request
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
