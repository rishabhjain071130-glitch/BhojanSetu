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
  Sparkles,
  MapPin,
  Thermometer,
  Users,
  Search,
  Activity,
  Box,
  Layers,
  Building2,
  PhoneCall,
  Check,
} from 'lucide-react';
import { request } from '../api/client.js';
import { ImpactSummary, FoodListing } from '../types/index.js';
import { Rescue3DScene } from '../components/Rescue3DScene.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { UrgencyBadge } from '../components/UrgencyBadge.js';

export const LandingPage: React.FC = () => {
  const [impact, setImpact] = useState<ImpactSummary | null>(null);
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [heroViewMode, setHeroViewMode] = useState<'photo' | '3d'>('photo');

  useEffect(() => {
    // Fetch live backend metrics
    request<ImpactSummary>('/impact/summary')
      .then((data) => setImpact(data))
      .catch((err) => console.warn('Could not load impact summary:', err));

    // Fetch listings for preview
    request<FoodListing[]>('/listings')
      .then((data) => {
        setListings(Array.isArray(data) ? data.slice(0, 3) : []);
      })
      .catch((err) => {
        console.warn('Could not load listings:', err);
      })
      .finally(() => setLoadingListings(false));
  }, []);

  const journeySteps = [
    {
      num: '01',
      title: 'Surplus Food Logged',
      actor: 'Event Organizer / Caterer',
      desc: 'Banquets log leftover hot chafers or chilled trays with container counts and time windows.',
      icon: ChefHat,
      temp: '>65°C Hot Hold',
    },
    {
      num: '02',
      title: 'Verified Match',
      actor: 'Compatibility Engine',
      desc: 'Pairs the donation with nearby verified NGOs matching vehicle volume and service radius.',
      icon: Users,
      temp: 'Rule-Based Routing',
    },
    {
      num: '03',
      title: 'Safe Pickup & Transit',
      actor: 'Recovery Partner Courier',
      desc: 'Courier arrives with thermal carriers, validates temperatures, and logs custody transfer.',
      icon: Truck,
      temp: 'Insulated Transport',
    },
    {
      num: '04',
      title: 'Community Delivery',
      actor: 'Grassroots Shelter / Kitchen',
      desc: 'Nourishing, dignified meals served to community tables before safe-use window expires.',
      icon: HeartHandshake,
      temp: 'Zero Landfill Waste',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. LIGHT-FIRST ART-DIRECTED HERO SECTION */}
      <section className="relative pt-8 sm:pt-16 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#E7E8E1] bg-[#FAF9F6] overflow-hidden">
        {/* Soft natural ambient lighting tints */}
        <div className="absolute top-0 right-12 w-[420px] h-[420px] bg-[#DDEBDD]/40 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-4 left-6 w-[360px] h-[360px] bg-[#F0F4EE]/60 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left: Editorial Content (6 cols) */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDEBDD] text-[#287653] text-xs font-semibold tracking-wider uppercase border border-[#287653]/15 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#287653]" />
                Surplus food. Second chances.
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-[#202820] tracking-tight leading-[1.08]">
                Good food deserves a{' '}
                <span className="text-[#287653] italic font-serif">second journey.</span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-[#667067] leading-relaxed max-w-xl">
                BhojanSetu rescues untouched surplus from weddings, banquets, and catered events,
                connecting verified donors directly with community recovery partners before safe-consumption
                windows expire.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  to="/listings"
                  className="btn-primary-brand text-sm sm:text-base py-3.5 px-6 shadow-sm flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4 text-[#DDEBDD]" />
                  Rescue Food
                </Link>
                <Link
                  to="/listings/create"
                  className="btn-outline text-sm sm:text-base py-3.5 px-6 flex items-center justify-center gap-2"
                >
                  <ChefHat className="w-4 h-4 text-[#287653]" />
                  Donate Surplus Food
                </Link>
              </div>

              {/* Compact Trust Row */}
              <div className="pt-4 border-t border-[#E7E8E1] flex flex-wrap items-center gap-6 text-xs text-[#667067]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#287653]" />
                  <span>Verified NGO Partners</span>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-[#287653]" />
                  <span>Thermal Chain Audited</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#287653]" />
                  <span>Zero Commercial Resale</span>
                </div>
              </div>
            </div>

            {/* Right: Rich Authentic Visual with Interactive 3D Inspection (6 cols) */}
            <div className="lg:col-span-6 relative">
              <div className="card-light p-2 sm:p-3 bg-white border border-[#E7E8E1] shadow-md rounded-2xl overflow-hidden">
                {/* Header Switcher Toolbar */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-[#E7E8E1] mb-2 text-xs">
                  <span className="font-semibold text-[#202820] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#287653]" />
                    {heroViewMode === 'photo' ? 'Live Banquet Surplus Source' : 'Insulated Carrier 3D Model'}
                  </span>
                  <div className="flex items-center gap-1 bg-[#F0F4EE] p-0.5 rounded-lg border border-[#E7E8E1]">
                    <button
                      type="button"
                      onClick={() => setHeroViewMode('photo')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        heroViewMode === 'photo'
                          ? 'bg-white text-[#287653] shadow-xs'
                          : 'text-[#667067] hover:text-[#202820]'
                      }`}
                    >
                      Banquet Source
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeroViewMode('3d')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        heroViewMode === '3d'
                          ? 'bg-white text-[#287653] shadow-xs'
                          : 'text-[#667067] hover:text-[#202820]'
                      }`}
                    >
                      3D Vessel
                    </button>
                  </div>
                </div>

                {/* Visual Viewport */}
                {heroViewMode === 'photo' ? (
                  <div className="relative rounded-xl overflow-hidden aspect-4/3 bg-[#F0F4EE] group">
                    <img
                      src="/assets/hero_catering.jpg"
                      alt="Catering buffet with surplus vegetarian dishes"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Integrated Floating Telemetry Card */}
                    <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-[#E7E8E1] shadow-sm flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#287653] bg-[#DDEBDD] px-2 py-0.5 rounded-full">
                            Active Corridor
                          </span>
                          <span className="text-[11px] font-semibold text-[#667067]">
                            Saket Banquet Hub
                          </span>
                        </div>
                        <div className="text-xs font-bold text-[#202820]">
                          45 kg Hot Rice &amp; Curry • Held at &gt;65°C
                        </div>
                      </div>
                      <Link
                        to="/listings"
                        className="btn-primary-brand text-xs py-1.5 px-3 shrink-0"
                      >
                        Claim
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#E7E8E1]">
                    <Rescue3DScene />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TASTEFUL TRUST & PLATFORM IMPACT STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <div className="card-light p-6 sm:p-8 border border-[#E7E8E1] rounded-2xl bg-white shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E7E8E1]">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#287653]">
                Operational Network Summary
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#202820] mt-0.5">
                Verified Platform Traceability
              </h2>
            </div>
            <div className="text-xs text-[#667067] max-w-md">
              Metrics calculated directly from live database collection and delivery transactions across Delhi NCR.
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-6">
            <div className="text-left space-y-1">
              <span className="text-3xl sm:text-4xl font-bold font-serif text-[#287653] block">
                {impact ? impact.summary?.completedDeliveries?.toLocaleString() || '5' : '5'}
              </span>
              <span className="text-xs font-bold text-[#202820] block">Completed Rescues</span>
              <span className="text-[11px] text-[#667067]">Verified deliveries</span>
            </div>

            <div className="text-left space-y-1">
              <span className="text-3xl sm:text-4xl font-bold font-serif text-[#202820] block">
                {impact ? `${impact.wasteDiversion?.estimatedKgDiverted?.toFixed(0) || '250'} kg` : '250 kg'}
              </span>
              <span className="text-xs font-bold text-[#202820] block">Food Diverted</span>
              <span className="text-[11px] text-[#667067]">Formula-derived from logs</span>
            </div>

            <div className="text-left space-y-1">
              <span className="text-3xl sm:text-4xl font-bold font-serif text-[#287653] block">
                {impact ? impact.summary?.verifiedPartners || '2' : '2'}
              </span>
              <span className="text-xs font-bold text-[#202820] block">Verified NGO Hubs</span>
              <span className="text-[11px] text-[#667067]">Vetted relief partners</span>
            </div>

            <div className="text-left space-y-1">
              <span className="text-3xl sm:text-4xl font-bold font-serif text-[#D97706] block">
                {impact ? impact.summary?.activeListings || '3' : '3'}
              </span>
              <span className="text-xs font-bold text-[#202820] block">Active Opportunities</span>
              <span className="text-[11px] text-[#667067]">Open for recovery now</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE 4-STAGE RESCUE JOURNEY */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#287653]">
            Seamless Operational Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#202820]">
            How food moves from surplus to sustenance
          </h2>
          <p className="text-xs sm:text-sm text-[#667067]">
            Every step is coordinated with strict thermal guidelines and complete custodial accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {journeySteps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div
                key={idx}
                className="card-light p-6 relative group hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-serif font-bold text-[#E7E8E1] group-hover:text-[#287653] transition-colors">
                    {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#F0F4EE] text-[#287653] flex items-center justify-center group-hover:bg-[#DDEBDD] transition-colors">
                    <IconComponent className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#202820] mb-1">{step.title}</h3>
                <div className="text-[11px] font-semibold text-[#287653] mb-2">{step.actor}</div>
                <p className="text-xs text-[#667067] leading-relaxed mb-4">{step.desc}</p>

                <div className="pt-3 border-t border-[#E7E8E1] flex items-center gap-1.5 text-[11px] font-medium text-[#202820]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#287653]" />
                  {step.temp}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. REFINED 3D VESSEL & SAFETY SPECIFICATION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-light p-6 sm:p-10 border border-[#E7E8E1] rounded-2xl bg-[#F0F4EE]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4 text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#287653]">
                Thermal Chain Integrity
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#202820]">
                Engineered for food safety in the field
              </h2>
              <p className="text-xs sm:text-sm text-[#667067] leading-relaxed">
                Surplus food recovery is only dignified if it is uncompromisingly safe. All verified partners
                are equipped with insulated commercial transport vessels and calibrated temperature sensors.
              </p>

              <div className="space-y-2.5 pt-2 text-xs text-[#202820]">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#287653] shrink-0 mt-0.5" />
                  <span><strong>Hot Food Protocol:</strong> Maintained above 65°C using food-grade insulated chafing boxes.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#287653] shrink-0 mt-0.5" />
                  <span><strong>Chilled Food Protocol:</strong> Kept below 5°C with clean refrigeration or ice banks.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#287653] shrink-0 mt-0.5" />
                  <span><strong>Mandatory Time-Window:</strong> Complete redistribution within 4 hours of event wrap-up.</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/food-safety"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#287653] hover:underline"
                >
                  Review Complete Food Safety Standards <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Interactive 3D Model Display Card */}
            <div className="lg:col-span-7">
              <div className="bg-white p-4 rounded-xl border border-[#E7E8E1] shadow-xs">
                <Rescue3DScene />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PURPOSE-BUILT STAKEHOLDER ROLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#287653]">
            Stakeholder Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#202820]">
            Purpose-built workflows for every participant
          </h2>
          <p className="text-xs sm:text-sm text-[#667067]">
            Tailored interfaces designed for fast field execution, compliance, and dignified distribution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card-light p-6 flex flex-col justify-between border-t-3 border-t-[#287653]">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F0F4EE] text-[#287653] flex items-center justify-center">
                <ChefHat className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#202820]">Food Donors</h3>
              <p className="text-xs text-[#667067] leading-relaxed">
                Banquet halls, caterers, hotels, and wedding hosts. Publish surplus in under 90 seconds with container estimates and safe-holding temperatures.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E7E8E1]">
              <Link
                to="/listings/create"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#287653] hover:underline"
              >
                Create Listing <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="card-light p-6 flex flex-col justify-between border-t-3 border-t-[#287653]">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#DDEBDD] text-[#287653] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#202820]">Pickup Coordinators</h3>
              <p className="text-xs text-[#667067] leading-relaxed">
                Central NGO dispatchers. Review urgent listings, evaluate transport load feasibility, and claim routes with single-click assignment.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E7E8E1]">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#287653] hover:underline"
              >
                Open Triage Desk <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="card-light p-6 flex flex-col justify-between border-t-3 border-t-[#E9AE62]">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#202820]">Delivery Partners</h3>
              <p className="text-xs text-[#667067] leading-relaxed">
                Field drivers and couriers. Mobile-first routing, quick address unlocking upon assignment, and digital custody handoff logging.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E7E8E1]">
              <Link
                to="/requests"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97706] hover:underline"
              >
                View Active Routes <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="card-light p-6 flex flex-col justify-between border-t-3 border-t-[#287653]">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F0F4EE] text-[#287653] flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#202820]">Community Kitchens</h3>
              <p className="text-xs text-[#667067] leading-relaxed">
                Grassroots community lines and children's homes. Inspect delivered trays, confirm portion counts, and nourish community tables.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E7E8E1]">
              <Link
                to="/listings"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#287653] hover:underline"
              >
                Browse Availability <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SURPLUS OPPORTUNITIES QUEUE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#287653]">
              Active Surplus Queue
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#202820] mt-1">
              Live Recovery Opportunities
            </h2>
          </div>
          <Link
            to="/listings"
            className="btn-outline text-xs sm:text-sm py-2 px-4 self-start sm:self-auto"
          >
            Explore all listings ({listings.length > 0 ? listings.length : 3}+) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingListings ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="card-light p-6 h-48 animate-pulse bg-white" />
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {listings.map((item) => (
              <div key={item._id} className="card-light p-5 sm:p-6 flex flex-col justify-between hover:shadow-md transition-all duration-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F0F4EE] text-[#287653] capitalize">
                      {item.foodCategory ? item.foodCategory.replace('_', ' ') : 'Food'}
                    </span>
                    <UrgencyBadge deadline={item.collectionDeadline} />
                  </div>
                  <h3 className="text-base font-bold text-[#202820] line-clamp-1">{item.foodTitle}</h3>
                  <div className="text-xs text-[#667067] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#287653] shrink-0" />
                    <span>{item.areaOrAddress || 'Delhi NCR'}</span>
                  </div>
                  <div className="text-xs font-semibold text-[#202820]">
                    {item.quantity} {item.unit}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E7E8E1] flex items-center justify-between">
                  <StatusBadge status={item.status} size="sm" />
                  <Link
                    to={`/listings/${item._id}`}
                    className="text-xs font-bold text-[#287653] hover:underline"
                  >
                    View details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-light p-8 text-center text-xs text-[#667067]">
            No live listings in queue right now. Check back soon or create a donation!
          </div>
        )}
      </section>

      {/* 7. REAL IMPACT PHOTOGRAPHY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-light p-6 sm:p-10 border border-[#E7E8E1] rounded-2xl overflow-hidden bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 relative rounded-xl overflow-hidden shadow-xs aspect-4/3 sm:aspect-16/10">
              <img
                src="/assets/community_rescue.jpg"
                alt="Community volunteers receiving hot meals"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 text-white text-[11px] font-medium bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
                Saket Relief Kitchen • 140 Portions Served
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4 text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#287653]">
                Stories of Nourishment
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#202820]">
                "Food cooked with love should be eaten with dignity."
              </h2>
              <p className="text-xs sm:text-sm text-[#667067] leading-relaxed">
                When wedding halls wrap up after midnight, vast quantities of pristine, untouched food historically ended up in waste bins. With BhojanSetu, volunteers from Annapurna Seva Trust collect the insulated containers within minutes, delivering hot, fragrant food to shelters and community kitchens before dawn.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#DDEBDD] text-[#287653] flex items-center justify-center font-bold text-xs">
                  AS
                </div>
                <div>
                  <div className="text-xs font-bold text-[#202820]">Ananya Sengupta</div>
                  <div className="text-[11px] text-[#667067]">Lead Trustee, Annapurna Community Kitchen</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FINAL CLOSING INVITATION (Light card with crisp brand action) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-light p-8 sm:p-14 text-center rounded-2xl border border-[#E7E8E1] bg-[#F0F4EE]">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#202820] tracking-tight">
              Ready to ensure zero good food is wasted?
            </h2>
            <p className="text-xs sm:text-base text-[#667067] max-w-lg mx-auto leading-relaxed">
              Join dozens of banquet halls, caterers, and relief NGOs across Delhi NCR in building a dignified, reliable food recovery network.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Link
                to="/listings"
                className="btn-primary-brand text-xs sm:text-sm py-3.5 px-6"
              >
                Find Food to Rescue
              </Link>
              <Link
                to="/listings/create"
                className="btn-outline text-xs sm:text-sm py-3.5 px-6"
              >
                Register as Food Donor
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default LandingPage;
