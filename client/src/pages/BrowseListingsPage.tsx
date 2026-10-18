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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
          Surplus Discovery Hub
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-gray-950">
          Browse Eligible Event Surplus Food
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-2xl">
          Discover non-expired surplus batches from weddings, corporate banquets, and caterers.
          Review handling conditions and claim with verified recovery partner credentials.
        </p>
      </div>

      <FoodSafetyBanner compact />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Filter by locality or area (e.g. Saket, Connaught Place, Gurugram)..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-semibold transition-colors shrink-0"
          >
            Search Locality
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100 text-xs">
          <div className="flex items-center gap-1 text-gray-500 font-medium">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </div>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-2.5 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
          >
            <option value="all">All Food Categories</option>
            <option value="cooked_meals">Cooked Meals</option>
            <option value="packaged_ration">Packaged Rations</option>
            <option value="bakery">Bakery / Bread</option>
            <option value="desserts">Desserts / Sweets</option>
            <option value="fruits_vegetables">Fruits & Vegetables</option>
          </select>

          {/* Event Type Filter */}
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="px-2.5 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
          >
            <option value="all">All Event Types</option>
            <option value="wedding">Weddings</option>
            <option value="banquet">Banquets</option>
            <option value="catering">Catering</option>
            <option value="college">College Festivals</option>
            <option value="community">Community Gatherings</option>
          </select>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-2.5 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
          >
            <option value="all">Open & Requested</option>
            <option value="open">Open Only</option>
            <option value="assigned">Assigned / In Progress</option>
            <option value="delivered">Delivered Rescues</option>
          </select>

          {/* Urgent Toggle */}
          <button
            type="button"
            onClick={() => setUrgentOnly(!urgentOnly)}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 font-medium transition-all ${
              urgentOnly
                ? 'bg-rose-50 border-rose-300 text-rose-800'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${urgentOnly ? 'text-rose-600' : 'text-gray-400'}`} />
            Urgent Only (&lt;4h window)
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
            const isAvailable = listing.status === 'open' || listing.status === 'requested';
            return (
              <div
                key={listing._id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:border-emerald-600 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                      {listing.eventType}
                    </span>
                    <UrgencyBadge deadline={listing.collectionDeadline} />
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-gray-950 line-clamp-1">
                      {listing.foodTitle}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium truncate mt-0.5">
                      Event: {listing.eventName}
                    </p>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {listing.description}
                  </p>

                  <div className="p-3 bg-gray-50 rounded-xl space-y-1.5 text-xs text-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Surplus Volume:</span>
                      <strong className="text-gray-900 text-sm">
                        {listing.quantity} {listing.unit}
                      </strong>
                    </div>

                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-gray-500">Holding Temp / Storage:</span>
                      <span className="font-medium text-gray-800 truncate max-w-[170px]" title={listing.storageConditions}>
                        {listing.storageConditions}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-gray-500">
                      <span>Locality:</span>
                      <span className="font-medium text-gray-800 flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-emerald-700" />
                        {listing.areaOrAddress}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3.5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
                  <StatusBadge status={listing.status} size="sm" />

                  <Link
                    to={`/listings/${listing._id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline"
                  >
                    View Details & Rescue <ArrowRight className="w-3.5 h-3.5" />
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
