import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { request } from '../api/client.js';
import { FoodListing } from '../types/index.js';
import { ErrorAlert } from '../components/ErrorAlert.js';
import { FoodSafetyBanner } from '../components/FoodSafetyBanner.js';
import {
  ChefHat,
  Clock,
  ShieldCheck,
  Lock,
  Calendar,
  Building2,
  Utensils,
  MapPin,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

export const CreateListingPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<any[]>([]);

  // Default initial values
  const now = new Date();
  const defaultPrep = new Date(now.getTime() - 60 * 60 * 1000).toISOString().slice(0, 16);
  const defaultDeadline = new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString().slice(0, 16);

  const [formData, setFormData] = useState({
    eventName: '',
    eventType: 'wedding',
    foodTitle: '',
    foodCategory: 'cooked_meals',
    description: '',
    quantity: '30',
    unit: 'kg',
    preparedAt: defaultPrep,
    storageConditions: 'Held hot in insulated food pans > 65°C',
    allergenNotes: '',
    collectionDeadline: defaultDeadline,
    areaOrAddress: '',
    pickupInstructions: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isDeadlineInPast = () => {
    return new Date(formData.collectionDeadline).getTime() <= Date.now();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setErrorDetails([]);

      if (isDeadlineInPast()) {
        setError('Collection deadline must be set in the future.');
        setLoading(false);
        return;
      }

      const payload = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        preparedAt: new Date(formData.preparedAt).toISOString(),
        collectionDeadline: new Date(formData.collectionDeadline).toISOString(),
      };

      const res = await request<{ success: boolean; listing: FoodListing }>('/listings', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      navigate(`/listings/${res.listing._id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create surplus food listing.');
      if (err.details) setErrorDetails(err.details);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="text-xs text-gray-500 hover:text-emerald-800">
            Dashboard
          </Link>
          <span className="text-xs text-gray-400">/</span>
          <span className="text-xs font-semibold text-emerald-800">List Surplus Food</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-gray-950 flex items-center gap-2.5">
          <ChefHat className="w-7 h-7 text-emerald-800" />
          List Event Surplus Food
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Capture preparation timestamps, thermal storage condition notes, and an operational collection deadline.
        </p>
      </div>

      <FoodSafetyBanner compact />

      {error && <ErrorAlert message={error} details={errorDetails} />}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        {/* Group 1: Event Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Building2 className="w-4 h-4 text-emerald-800" />
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              1. Event & Context
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Event Name *
              </label>
              <input
                type="text"
                name="eventName"
                required
                value={formData.eventName}
                onChange={handleChange}
                placeholder="e.g. Kapoor-Mehta Wedding Reception"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Event Type *
              </label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white"
              >
                <option value="wedding">Wedding Function</option>
                <option value="banquet">Banquet / Conference</option>
                <option value="catering">Corporate / Private Catering</option>
                <option value="college">College / University Festival</option>
                <option value="community">Community / Religious Gathering</option>
                <option value="other">Other Event</option>
              </select>
            </div>
          </div>
        </div>

        {/* Group 2: Food & Quantity Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Utensils className="w-4 h-4 text-emerald-800" />
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              2. Food Details & Quantity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Food Title / Name *
              </label>
              <input
                type="text"
                name="foodTitle"
                required
                value={formData.foodTitle}
                onChange={handleChange}
                placeholder="e.g. Mixed Veg Dum Biryani & Dal Makhani"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Food Category *
              </label>
              <select
                name="foodCategory"
                value={formData.foodCategory}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white"
              >
                <option value="cooked_meals">Fresh Cooked Meals (Buffet/Curries)</option>
                <option value="packaged_ration">Packaged / Sealed Rations</option>
                <option value="bakery">Bakery / Bread / Pastries</option>
                <option value="desserts">Sweets & Desserts</option>
                <option value="fruits_vegetables">Fresh Fruits & Vegetables</option>
                <option value="beverages">Packaged Beverages</option>
                <option value="other">Other Food</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Detailed Description *
            </label>
            <textarea
              name="description"
              rows={3}
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe dishes, untouched condition, packaging state (e.g. pristine buffet food maintained in clean commercial food pans)..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Surplus Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                required
                min="0.5"
                step="0.5"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g. 40"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Measurement Unit *
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="servings">Individual Servings</option>
                <option value="meal_boxes">Meal Boxes</option>
                <option value="trays">Full Catering Trays</option>
                <option value="other">Other Unit</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Allergen & Dietary Notes (Optional)
            </label>
            <input
              type="text"
              name="allergenNotes"
              value={formData.allergenNotes}
              onChange={handleChange}
              placeholder="e.g. Vegetarian, contains dairy (paneer/butter), nut-free"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>
        </div>

        {/* Group 3: Temperature, Storage & Safety Window */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <ShieldCheck className="w-4 h-4 text-emerald-800" />
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              3. Handling, Safety & Critical Deadlines
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Preparation Date / Time *
              </label>
              <input
                type="datetime-local"
                name="preparedAt"
                required
                value={formData.preparedAt}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
              <span className="text-[10px] text-gray-500">
                When was this batch finished in the kitchen?
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Collection Deadline * (Must be future)
              </label>
              <input
                type="datetime-local"
                name="collectionDeadline"
                required
                value={formData.collectionDeadline}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:outline-none ${
                  isDeadlineInPast()
                    ? 'border-rose-400 bg-rose-50/50 text-rose-900'
                    : 'border-gray-300 focus:ring-emerald-700'
                }`}
              />
              {isDeadlineInPast() ? (
                <span className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3 h-3" /> Deadline must be in the future
                </span>
              ) : (
                <span className="text-[10px] text-gray-500">
                  Cut-off time after which food can no longer be safely collected.
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Storage & Temperature Handling Conditions *
            </label>
            <input
              type="text"
              name="storageConditions"
              required
              value={formData.storageConditions}
              onChange={handleChange}
              placeholder="e.g. Hot holding > 65°C, or refrigerated < 5°C, or sealed ambient containers"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>
        </div>

        {/* Group 4: Locality & Locked Pickup Hand-off */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <MapPin className="w-4 h-4 text-emerald-800" />
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              4. Locality & Private Pickup Coordination
            </h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Approximate Area / Locality * (Publicly visible to partners)
            </label>
            <input
              type="text"
              name="areaOrAddress"
              required
              value={formData.areaOrAddress}
              onChange={handleChange}
              placeholder="e.g. South Delhi - Saket Banquet Cluster"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
            <span className="text-[10px] text-gray-500">
              General neighbourhood or zone used for discovery and rule-based proximity scoring.
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              Private Pickup Instructions & Contact * (Locked to assigned partner only)
            </div>
            <textarea
              name="pickupInstructions"
              rows={2}
              required
              value={formData.pickupInstructions}
              onChange={handleChange}
              placeholder="e.g. Gate 3 Loading Dock behind Hall A. Ask for Executive Chef Ramesh on phone +91 98765 00000."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white"
            />
            <span className="text-[10px] text-gray-500 block">
              🛡️ Privacy Protection: These private instructions will remain masked until you explicitly approve a verified partner's request.
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <Link
            to="/dashboard"
            className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading || isDeadlineInPast()}
            className="px-6 py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              'Creating Listing...'
            ) : (
              <>
                <CheckCircle className="w-4 h-4" /> Publish Surplus Listing
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
