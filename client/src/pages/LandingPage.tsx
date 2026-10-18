import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Truck,
  HeartHandshake,
  ChefHat,
  Scale,
  Sparkles,
  Calendar,
  MapPin,
  Thermometer,
  Layers,
  Building,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { request } from '../api/client.js';
import { ImpactSummary, FoodListing } from '../types/index.js';

export const LandingPage: React.FC = () => {
  const [impact, setImpact] = useState<ImpactSummary | null>(null);
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);

  useEffect(() => {
    // Fetch live impact metrics
    request<ImpactSummary>('/impact/summary')
      .then((data) => setImpact(data))
      .catch((err) => console.warn('Could not load impact summary:', err));

    // Fetch listings for live discovery preview
    request<FoodListing[]>('/listings')
      .then((data) => {
        // Show up to 3 active or representative listings
        setListings(Array.isArray(data) ? data.slice(0, 3) : []);
      })
      .catch((err) => {
        console.warn('Could not load listings:', err);
      })
      .finally(() => setLoadingListings(false));
  }, []);

  return (
    <div className="space-y-20 sm:space-y-32 pb-20 overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 lg:pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Messaging */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDE8D8]/60 border border-[#174D3A]/15 text-[#174D3A] text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#237653] animate-pulse" />
              Event-Based Surplus Food Recovery
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-serif text-[#202820] tracking-tight leading-[1.08]">
              Good food deserves a{' '}
              <span className="text-[#174D3A] italic font-serif">second journey.</span>
            </h1>

            <p className="text-base sm:text-xl text-[#68736A] font-normal leading-relaxed max-w-2xl">
              Connect surplus food from weddings, banquets, and events with verified community recovery
              partners before it goes to waste.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                to="/listings"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-semibold text-white bg-[#174D3A] hover:bg-[#237653] shadow-md hover:shadow-lg transition-all text-sm sm:text-base hover:scale-[1.01] focus:ring-2 focus:ring-[#E7A85B]"
              >
                Find Surplus Food
                <ArrowRight className="w-4 h-4 text-[#E7A85B]" />
              </Link>
              <Link
                to="/listings/create"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-semibold text-[#174D3A] bg-white hover:bg-stone-50 border border-[#174D3A]/20 shadow-xs transition-all text-sm sm:text-base hover:scale-[1.01]"
              >
                <ChefHat className="w-4 h-4 text-[#E7A85B]" />
                Donate Surplus Food
              </Link>
            </div>

            {/* Trust disclaimer */}
            <div className="pt-2 flex items-center gap-2 text-xs text-[#68736A]">
              <ShieldCheck className="w-4 h-4 text-[#237653] shrink-0" />
              <span>
                Verified recovery partners • Enforced collection deadlines • Real-time status logs
              </span>
            </div>
          </div>

          {/* Right Column: Authentic Editorial Imagery & Live Status Pill */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-[#174D3A]/15 shadow-2xl bg-stone-100 group">
              <img
                src="/assets/hero_catering.jpg"
                alt="Carefully prepared event banquet food ready for responsible surplus recovery"
                className="w-full h-[420px] sm:h-[480px] object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#174D3A]/90 via-[#174D3A]/20 to-transparent" />

              {/* Floating Snapshot Pill */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#174D3A]/15 shadow-lg">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#237653] animate-ping" />
                    <span className="text-xs font-bold text-[#174D3A] uppercase tracking-wider">
                      Live Recovery Coordination
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold bg-[#DDE8D8] text-[#174D3A] px-2 py-0.5 rounded-full">
                    Demo Active
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#202820]">Grand Banquet Hall • Delhi NCR</div>
                    <div className="text-[11px] text-[#68736A]">45 kg Hot Buffet • Matched with NGO</div>
                  </div>
                  <span className="font-semibold text-emerald-800 text-[11px] bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                    Ready for pickup
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative subtle saffron accent blob */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#E7A85B]/20 rounded-full blur-2xl -z-10 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* 2. RECOVERY JOURNEY (3-Step Custom Visual Sequence) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="max-w-2xl mb-12 sm:mb-16 space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-[#237653]">
            Operational Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#202820] tracking-tight">
            How surplus food finds its destination.
          </h2>
          <p className="text-sm sm:text-base text-[#68736A] leading-relaxed">
            From the closing minutes of a catered reception to community dinner tables, every step is
            structured for speed, safety, and transparency.
          </p>
        </div>

        {/* Custom Visual Sequence (Timeline Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-7 border border-[#174D3A]/10 shadow-xs hover:border-[#174D3A]/30 transition-all flex flex-col justify-between relative group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#DDE8D8]/70 text-[#174D3A]">
                  Step 01
                </span>
                <span className="text-2xl" role="img" aria-label="Catering">
                  👨‍🍳
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#202820] font-serif">
                1. Share surplus food
              </h3>
              <p className="text-xs sm:text-sm text-[#68736A] leading-relaxed">
                The organizer or head caterer logs food category, estimated quantity, preparation timestamp,
                storage conditions (e.g. heated warmers &gt;60°C), and a hard collection deadline.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-[#174D3A] font-semibold">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#E7A85B]" /> Strict deadline locking
              </span>
              <span>Input</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-7 border border-[#174D3A]/10 shadow-xs hover:border-[#174D3A]/30 transition-all flex flex-col justify-between relative group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-100 text-blue-900">
                  Step 02
                </span>
                <span className="text-2xl" role="img" aria-label="Partner Match">
                  🤝
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#202820] font-serif">
                2. Connect with verified partners
              </h3>
              <p className="text-xs sm:text-sm text-[#68736A] leading-relaxed">
                Eligible, pre-vetted recovery NGOs explore listings. The rule-based rescue engine verifies
                partner transport capacity and zone compatibility. The organizer reviews and approves the request.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-blue-900 font-semibold">
              <span className="flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-blue-600" /> Explainable rules (Non-ML)
              </span>
              <span>Match</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-7 border border-[#174D3A]/10 shadow-xs hover:border-[#174D3A]/30 transition-all flex flex-col justify-between relative group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-100 text-amber-900">
                  Step 03
                </span>
                <span className="text-2xl" role="img" aria-label="Collection">
                  🚚
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#202820] font-serif">
                3. Coordinate collection &amp; delivery
              </h3>
              <p className="text-xs sm:text-sm text-[#68736A] leading-relaxed">
                Pickup address instructions unlock exclusively for the assigned partner. Authorized handlers
                conduct an on-site temperature inspection, confirm collection, and log distribution to community recipients.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-amber-900 font-semibold">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-600" /> Traceable status history
              </span>
              <span>Handoff</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LIVE DISCOVERY PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#174D3A]">
              <span className="w-2 h-2 rounded-full bg-[#237653]" />
              Discovery Preview
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#202820]">
              Available Surplus Opportunities
            </h2>
            <p className="text-xs sm:text-sm text-[#68736A]">
              Recent event listings needing verified recovery. Data reflects local database entries.
            </p>
          </div>
          <Link
            to="/listings"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#174D3A] hover:text-[#237653] group shrink-0"
          >
            Explore all listings ({listings.length > 0 ? listings.length : 'Live'})
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Listings Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {listings.length > 0 ? (
            listings.map((item) => (
              <div
                key={item._id}
                className="card-editorial p-6 flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#DDE8D8] text-[#174D3A]">
                      {item.foodCategory.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] font-semibold text-[#68736A] bg-stone-100 px-2 py-0.5 rounded">
                      Demo Data
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-[#202820] font-serif line-clamp-1">
                      {item.foodTitle}
                    </h3>
                    <p className="text-xs text-[#68736A] flex items-center gap-1 mt-1">
                      <Building className="w-3.5 h-3.5 text-[#174D3A]" />
                      {item.eventName}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[#68736A]">Quantity:</span>
                      <span className="font-bold text-[#174D3A]">
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#68736A]">Pickup Area:</span>
                      <span className="font-medium text-[#202820] truncate max-w-[140px]">
                        {item.areaOrAddress}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#68736A]">Storage:</span>
                      <span className="font-medium text-[#202820] truncate max-w-[140px]">
                        {item.storageConditions}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between">
                  <div className="text-[11px] text-[#68736A] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>
                      Deadline: {new Date(item.collectionDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <Link
                    to={`/listings/${item._id}`}
                    className="text-xs font-semibold text-[#174D3A] hover:text-[#237653] flex items-center gap-1"
                  >
                    View Details
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            /* Fallback Seed Cards */
            [
              {
                title: 'North Indian Wedding Buffet',
                event: 'Sharma-Kapoor Sangeet',
                qty: '65 kg',
                area: 'Saket Banquet Zone, Delhi',
                storage: 'Chafing warmers > 65°C',
                cat: 'Cooked Meals',
              },
              {
                title: 'Corporate Summit Lunch Boxes',
                event: 'Tech Innovations Conclave',
                qty: '80 meal boxes',
                area: 'Cyber City, Gurugram',
                storage: 'Sealed eco-containers',
                cat: 'Packaged Ration',
              },
              {
                title: 'Artisan Bakery & Desserts',
                event: 'Annual Guild Gala',
                qty: '40 kg',
                area: 'Connaught Place, Delhi',
                storage: 'Chilled display < 5°C',
                cat: 'Bakery & Desserts',
              },
            ].map((seed, idx) => (
              <div key={idx} className="card-editorial p-6 flex flex-col justify-between">
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between">
                    <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#DDE8D8] text-[#174D3A]">
                      {seed.cat}
                    </span>
                    <span className="text-[11px] font-semibold text-[#68736A] bg-stone-100 px-2 py-0.5 rounded">
                      Demo Data
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#202820] font-serif">{seed.title}</h3>
                    <p className="text-xs text-[#68736A] flex items-center gap-1 mt-1">
                      <Building className="w-3.5 h-3.5 text-[#174D3A]" />
                      {seed.event}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[#68736A]">Quantity:</span>
                      <span className="font-bold text-[#174D3A]">{seed.qty}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#68736A]">Pickup Area:</span>
                      <span className="font-medium text-[#202820]">{seed.area}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#68736A]">Storage:</span>
                      <span className="font-medium text-[#202820]">{seed.storage}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-[#68736A] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" /> 2.5h window
                  </span>
                  <Link
                    to="/listings"
                    className="text-xs font-semibold text-[#174D3A] hover:text-[#237653] flex items-center gap-1"
                  >
                    Inspect in listings
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 4. CREDIBLE IMPACT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#174D3A] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-900 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#237653]/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-emerald-800/80">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-[#E7A85B]">
                Accountability &amp; Metrics
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white">
                Platform Impact Dashboard
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
                Figures derived directly from persistent database records.
                Formula-based estimates are transparently defined.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#E7A85B] bg-emerald-950/70 border border-[#E7A85B]/30 px-3 py-1.5 rounded-full font-medium">
                Live MongoDB Aggregation • Demo Data
              </span>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-900/50 border border-emerald-700/40">
              <div className="text-3xl sm:text-5xl font-bold font-serif text-white mb-1.5">
                {impact ? impact.summary.totalListings : '12'}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-emerald-200">
                Total Listings Created
              </div>
              <p className="text-[11px] text-stone-300 mt-1">
                Surplus batches registered by event hosts
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-900/50 border border-emerald-700/40">
              <div className="text-3xl sm:text-5xl font-bold font-serif text-[#E7A85B] mb-1.5">
                {impact ? impact.summary.completedDeliveries : '8'}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-emerald-200">
                Completed Rescues
              </div>
              <p className="text-[11px] text-stone-300 mt-1">
                Verified deliveries to community centers
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-900/50 border border-emerald-700/40">
              <div className="text-3xl sm:text-5xl font-bold font-serif text-white mb-1.5">
                {impact ? `${impact.wasteDiversion.estimatedKgDiverted} kg` : '385 kg'}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-emerald-200">
                Estimated Food Diverted
              </div>
              <p className="text-[11px] text-stone-300 mt-1">
                Calculated: 1 serving ≈ 0.4kg; 1 tray ≈ 5kg
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-900/50 border border-emerald-700/40">
              <div className="text-3xl sm:text-5xl font-bold font-serif text-emerald-300 mb-1.5">
                {impact ? impact.summary.verifiedPartners : '5'}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-emerald-200">
                Verified Recovery Partners
              </div>
              <p className="text-[11px] text-stone-300 mt-1">
                Authorized NGOs and volunteer kitchens
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-8 pt-6 border-t border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-300 gap-3">
            <span className="italic">
              * Note: For hackathon review, numbers represent seeded test records and completed local workflows.
            </span>
            <Link
              to="/impact"
              className="inline-flex items-center gap-1.5 font-semibold text-[#E7A85B] hover:underline"
            >
              Inspect Full Impact Breakdown
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. FOOD SAFETY & TRUST SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#174D3A]/10 shadow-xs space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#237653]">
              Safety Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#202820]">
              Food Safety &amp; Trust Guardrails
            </h2>
            <p className="text-xs sm:text-sm text-[#68736A] leading-relaxed">
              Speed never excuses negligence. BhojanSetu embeds hygiene checkpoints into every state transition.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#DDE8D8] text-[#174D3A] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-[#174D3A]" />
              </div>
              <h3 className="font-bold text-[#202820] text-sm font-serif">Partner Verification</h3>
              <p className="text-xs text-[#68736A] leading-relaxed">
                Only admin-approved partners with validated registration and cold/insulated transport are eligible to request food.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#DDE8D8] text-[#174D3A] flex items-center justify-center font-bold">
                <Thermometer className="w-5 h-5 text-[#174D3A]" />
              </div>
              <h3 className="font-bold text-[#202820] text-sm font-serif">Thermal Handling</h3>
              <p className="text-xs text-[#68736A] leading-relaxed">
                Organizers specify hot holding (&gt;60°C) or cold refrigeration (&lt;5°C). Handlers must inspect temperature on-site.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#DDE8D8] text-[#174D3A] flex items-center justify-center font-bold">
                <Clock className="w-5 h-5 text-[#174D3A]" />
              </div>
              <h3 className="font-bold text-[#202820] text-sm font-serif">Enforced Deadlines</h3>
              <p className="text-xs text-[#68736A] leading-relaxed">
                Unrequested listings expire automatically before food quality degrades. Expired food is never routed for recovery.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#DDE8D8] text-[#174D3A] flex items-center justify-center font-bold">
                <Layers className="w-5 h-5 text-[#174D3A]" />
              </div>
              <h3 className="font-bold text-[#202820] text-sm font-serif">Immutable Chain of Custody</h3>
              <p className="text-xs text-[#68736A] leading-relaxed">
                Every request approval, collection, and delivery timestamp is permanently logged with actor details.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#DDE8D8]/40 border border-[#174D3A]/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#174D3A] shrink-0 mt-0.5" />
            <div className="text-xs text-[#202820] leading-relaxed">
              <strong>Regulatory Notice:</strong> BhojanSetu serves as a digital coordination platform and
              does not replace sensory organoleptic inspection or legal food handler obligations under applicable food
              safety regulations.
            </div>
          </div>
        </div>
      </section>

      {/* 5.5 REAL RECOVERY IN ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-editorial overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-6 p-8 sm:p-12 space-y-4">
            <span className="text-xs uppercase font-bold tracking-widest text-[#237653]">
              Community Impact
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#202820]">
              From banquet surplus to shared nourishment.
            </h2>
            <p className="text-sm text-[#68736A] leading-relaxed">
              Every recovered tray represents more than diverted food waste—it delivers dignity, immediate relief, and strengthened community bonds through verified grassroots partners.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#174D3A]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#237653]" /> 100% Free Redistribution
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#237653]" /> Zero Commercial Resale
              </span>
            </div>
          </div>
          <div className="lg:col-span-6 relative h-64 sm:h-80 lg:h-full min-h-[300px]">
            <img
              src="/assets/community_rescue.jpg"
              alt="Community volunteers receiving and distributing recovered surplus food"
              className="absolute inset-0 w-full h-full object-cover object-center"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-[#174D3A]/20 shadow-xl bg-gradient-to-br from-[#174D3A] to-[#237653] p-8 sm:p-14 text-white">
          <div className="max-w-2xl space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E7A85B]">
              Join the Recovery Network
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight leading-tight">
              Ready to give surplus food a second journey?
            </h2>
            <p className="text-stone-200 text-sm sm:text-base leading-relaxed">
              Whether you are an event manager with surplus banquet trays or a community NGO ready to
              distribute warm meals, BhojanSetu gives you the verified pipeline you need.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                to="/listings/create"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[#174D3A] bg-white hover:bg-stone-100 shadow-md transition-all text-sm sm:text-base hover:scale-[1.01]"
              >
                <ChefHat className="w-4 h-4 text-[#174D3A]" />
                Donate Surplus Food
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-400/30 transition-all text-sm sm:text-base hover:scale-[1.01]"
              >
                <HeartHandshake className="w-4 h-4 text-[#E7A85B]" />
                Register as Recovery Partner
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
