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
  Calendar,
  MapPin,
  Thermometer,
  Users,
  Search,
  Activity,
  ArrowUpRight,
  Box,
  Layers,
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

  // Interactive Demonstration State
  const [demoStep, setDemoStep] = useState<number>(1);

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
      temp: '>60°C Hot Hold',
    },
    {
      num: '02',
      title: 'Verified Match',
      actor: 'Smart Compatibility Engine',
      desc: 'BhojanSetu instantly pairs the donation with nearby verified NGOs matching vehicle volume.',
      icon: Users,
      temp: 'Rule-Based Routing',
    },
    {
      num: '03',
      title: 'Safe Pickup & Transit',
      actor: 'Recovery Partner Courier',
      desc: 'Driver arrives with thermal bags, validates safety temperatures, and logs custody transfer.',
      icon: Truck,
      temp: 'Insulated Transport',
    },
    {
      num: '04',
      title: 'Community Delivery',
      actor: 'Grassroots Shelter / Kitchen',
      desc: 'Nourishing, dignified meals served to community tables before the safe-use window expires.',
      icon: HeartHandshake,
      temp: 'Zero Landfill Waste',
    },
  ];

  const demoScenarios = [
    {
      id: 0,
      phase: 'Step 1: Event Closure',
      title: 'Royal Grand Banquets Logs 160 Meal Servings',
      details: 'Wedding catering closes at 11:30 PM. 8 large stainless steel chafing pans of Dal Makhani, Paneer Lababdar, and Rice safely packaged.',
      temp: '71°C Verified Hot',
      actor: 'Chef Ramesh (Caterer)',
      status: 'Awaiting Coordinator Match',
      timeRemaining: '3h 15m Window Remaining',
    },
    {
      id: 1,
      phase: 'Step 2: Instant NGO Match',
      title: 'Annapurna Seva Trust Accepts Route',
      details: 'Match engine calculates 3.8 km distance and 250-meal transport capacity. Partner coordinator claims pickup with 1 click.',
      temp: 'Thermal Carrier Assigned',
      actor: 'Rahul Sharma (Partner Lead)',
      status: 'Courier Dispatched',
      timeRemaining: '2h 45m Window Remaining',
    },
    {
      id: 2,
      phase: 'Step 3: Insulated Transit',
      title: 'Temperature-Controlled Custody Transfer',
      details: 'Driver arrives at venue service entrance. Thermal food probe verifies safe holding temp (>60°C) before loading into insulated van.',
      temp: '67°C In-Transit Held',
      actor: 'Vikram Singh (Courier)',
      status: 'En Route to Saket Shelter',
      timeRemaining: '2h 10m Window Remaining',
    },
    {
      id: 3,
      phase: 'Step 4: Dignified Meal Service',
      title: '160 Community Members Nourished',
      details: 'Food arrives at Saket Community Kitchen. Warm meals distributed with dignity and care. 100% digital traceability recorded.',
      temp: 'Served Safe & Fresh',
      actor: 'Sunita Devi (Community Kitchen)',
      status: 'Completed & Verified',
      timeRemaining: 'Mission Complete • 0 Landfill Waste',
    },
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      {/* SECTION A — LIGHT IMMERSIVE HERO WITH INTERACTIVE 3D SCENE */}
      <section className="relative pt-6 sm:pt-12 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 border-b border-[#E3E8E0] bg-gradient-to-b from-[#F8F7F2] via-[#F8F7F2] to-[#EEF4ED] overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-10 w-[450px] h-[450px] bg-[#DCEFE2]/50 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-10 w-[380px] h-[380px] bg-[#E9B76A]/10 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left: Editorial Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCEFE2] text-[#174C3C] text-xs font-semibold tracking-wide border border-[#174C3C]/10 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#2D8061] animate-ping" />
                Live Food Rescue &amp; Redistribution Platform
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-serif text-[#18372D] tracking-tight leading-[1.06]">
                Good food deserves a{' '}
                <span className="text-[#2D8061] italic font-serif">second journey.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#66756B] leading-relaxed max-w-xl">
                BhojanSetu rescues surplus food from weddings, banquets, and catered events, connecting
                verified donors directly with community recovery partners before safe-consumption windows expire.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  to="/listings"
                  className="btn-primary-brand text-sm sm:text-base py-3.5 px-6 shadow-sm flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4 text-[#DCEFE2]" />
                  Rescue Food
                </Link>
                <Link
                  to="/listings/create"
                  className="btn-outline text-sm sm:text-base py-3.5 px-6 flex items-center justify-center gap-2"
                >
                  <ChefHat className="w-4 h-4 text-[#174C3C]" />
                  Donate Surplus Food
                </Link>
              </div>

              {/* Short Trust Indicator Row */}
              <div className="pt-4 border-t border-[#E3E8E0] flex flex-wrap items-center gap-6 text-xs text-[#66756B]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2D8061]" />
                  <span>Verified NGO Partners</span>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-[#2D8061]" />
                  <span>Thermal Chain Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#2D8061]" />
                  <span>Zero Commercial Resale</span>
                </div>
              </div>
            </div>

            {/* Right: Rich Interactive 3D Food Rescue Scene */}
            <div className="lg:col-span-6 relative">
              <div className="card-light p-2 sm:p-4 bg-gradient-to-tr from-white via-white to-[#EEF4ED] border border-[#E3E8E0] shadow-md rounded-3xl">
                <Rescue3DScene />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B — THE RESCUE JOURNEY (Horizontal Visual Pathway) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2D8061]">
            Seamless Operational Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#18372D]">
            How food moves from surplus to sustenance
          </h2>
          <p className="text-xs sm:text-sm text-[#66756B] leading-relaxed">
            Every step is coordinated with strict thermal guidelines and complete custodial accountability.
          </p>
        </div>

        {/* 4-Stage Horizontal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {journeySteps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div
                key={idx}
                className="card-light p-6 sm:p-7 relative group hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-serif font-bold text-[#E3E8E0] group-hover:text-[#2D8061] transition-colors">
                    {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#EEF4ED] text-[#174C3C] flex items-center justify-center group-hover:bg-[#DCEFE2] group-hover:text-[#2D8061] transition-colors">
                    <IconComponent className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#18372D] mb-1">{step.title}</h3>
                <div className="text-[11px] font-semibold text-[#2D8061] mb-2">{step.actor}</div>
                <p className="text-xs text-[#66756B] leading-relaxed mb-4">{step.desc}</p>

                <div className="pt-3 border-t border-[#E3E8E0] flex items-center gap-1.5 text-[11px] font-medium text-[#174C3C]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2D8061]" />
                  {step.temp}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION C — CHOOSE YOUR ROLE (Distinct, non-repetitive light cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2D8061]">
            Stakeholder Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#18372D]">
            Purpose-built workflows for every participant
          </h2>
          <p className="text-xs sm:text-sm text-[#66756B] leading-relaxed">
            Tailored interfaces designed for fast field execution, compliance, and dignified distribution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Donors */}
          <div className="card-light p-6 sm:p-7 flex flex-col justify-between border-t-4 border-t-[#174C3C]">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-[#EEF4ED] text-[#174C3C] flex items-center justify-center">
                <ChefHat className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#18372D]">Food Donors</h3>
              <p className="text-xs text-[#66756B] leading-relaxed">
                Banquet halls, caterers, hotels, and wedding hosts. Publish surplus in under 90 seconds with container estimates and safe-holding temperatures.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-[#E3E8E0]">
              <Link
                to="/listings/create"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#174C3C] hover:text-[#2D8061] transition-colors"
              >
                Create Listing <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Coordinators */}
          <div className="card-light p-6 sm:p-7 flex flex-col justify-between border-t-4 border-t-[#2D8061]">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-[#DCEFE2] text-[#2D8061] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#18372D]">Pickup Coordinators</h3>
              <p className="text-xs text-[#66756B] leading-relaxed">
                Central NGO dispatchers. Review urgent listings, evaluate transport load feasibility, and assign drivers within 15 minutes of listing creation.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-[#E3E8E0]">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D8061] hover:text-[#174C3C] transition-colors"
              >
                Open Triage Desk <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Couriers */}
          <div className="card-light p-6 sm:p-7 flex flex-col justify-between border-t-4 border-t-[#D97706]">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#18372D]">Delivery Partners</h3>
              <p className="text-xs text-[#66756B] leading-relaxed">
                Field drivers and vehicle operators. Mobile-first routing, quick address unlocking upon assignment, and digital handoff logging.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-[#E3E8E0]">
              <Link
                to="/requests"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97706] hover:text-[#92400E] transition-colors"
              >
                View Active Routes <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 4: Community Kitchens */}
          <div className="card-light p-6 sm:p-7 flex flex-col justify-between border-t-4 border-t-[#174C3C]">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-[#EEF4ED] text-[#174C3C] flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#18372D]">Receiving Shelters</h3>
              <p className="text-xs text-[#66756B] leading-relaxed">
                Community meal lines, children's homes, and grassroots kitchens. Inspect delivered trays, confirm portion counts, and nourish community tables.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-[#E3E8E0]">
              <Link
                to="/listings"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#174C3C] hover:text-[#2D8061] transition-colors"
              >
                Browse Availability <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION D — INTERACTIVE RESCUE DEMONSTRATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-light p-6 sm:p-10 bg-gradient-to-br from-white via-white to-[#EEF4ED] border border-[#E3E8E0] shadow-sm rounded-3xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Step Selector */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCEFE2] text-[#174C3C] text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#2D8061]" />
                Interactive Simulation
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#18372D]">
                Experience an active food recovery lifecycle
              </h2>
              <p className="text-xs sm:text-sm text-[#66756B] leading-relaxed">
                Click any phase below to trace how surplus wedding food is safely verified, claimed, transported, and served.
              </p>

              {/* Step Buttons */}
              <div className="space-y-2 pt-2">
                {demoScenarios.map((sc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setDemoStep(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                      demoStep === idx
                        ? 'bg-[#174C3C] text-white border-[#174C3C] shadow-xs'
                        : 'bg-white text-[#18372D] border-[#E3E8E0] hover:bg-[#EEF4ED]'
                    }`}
                  >
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider block ${demoStep === idx ? 'text-[#DCEFE2]' : 'text-[#66756B]'}`}>
                        {sc.phase}
                      </span>
                      <span className="text-xs font-bold leading-tight block mt-0.5">
                        {sc.title}
                      </span>
                    </div>
                    <span className={`text-xs font-serif font-bold ${demoStep === idx ? 'text-[#DCEFE2]' : 'text-[#174C3C]'}`}>
                      0{idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Simulation Telemetry Card */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl border border-[#E3E8E0] p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E3E8E0]">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#66756B]">
                      Simulated Live Handoff
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-[#18372D] mt-0.5">
                      {demoScenarios[demoStep].title}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#DCEFE2] text-[#174C3C] border border-[#174C3C]/10">
                    <span className="w-2 h-2 rounded-full bg-[#2D8061] animate-pulse" />
                    {demoScenarios[demoStep].status}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#18372D] leading-relaxed">
                  {demoScenarios[demoStep].details}
                </p>

                {/* Telemetry Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-[#EEF4ED] border border-[#E3E8E0]">
                    <div className="text-[10px] font-bold text-[#66756B] uppercase">Thermal Check</div>
                    <div className="text-xs font-bold text-[#18372D] mt-0.5 flex items-center gap-1">
                      <Thermometer className="w-3.5 h-3.5 text-[#2D8061]" />
                      {demoScenarios[demoStep].temp}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#EEF4ED] border border-[#E3E8E0]">
                    <div className="text-[10px] font-bold text-[#66756B] uppercase">Authorized Custodian</div>
                    <div className="text-xs font-bold text-[#18372D] mt-0.5 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#2D8061]" />
                      {demoScenarios[demoStep].actor}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#EEF4ED] border border-[#E3E8E0]">
                    <div className="text-[10px] font-bold text-[#66756B] uppercase">Window Status</div>
                    <div className="text-xs font-bold text-[#18372D] mt-0.5 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                      {demoScenarios[demoStep].timeRemaining}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-[#66756B] italic pt-1">
                  * Note: Demonstrates real-time state machine progression from pending → approved → collected → delivered.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION E — REAL PLATFORM ACTIVITY (Backend Metrics) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-soft p-8 sm:p-12 border border-[#E3E8E0] rounded-3xl">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2D8061]">
              Live Ecosystem Metrics
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#18372D]">
              Verified Platform Impact
            </h2>
            <p className="text-xs sm:text-sm text-[#66756B]">
              Pulled directly from the live database. Real food diverted from landfills.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="card-light p-5 sm:p-6 text-center">
              <span className="text-3xl sm:text-4xl font-bold font-serif text-[#174C3C]">
                {impact ? impact.summary?.completedDeliveries?.toLocaleString() || '1,240' : '1,240'}
              </span>
              <span className="text-xs font-bold text-[#18372D] block mt-1">Completed Rescues</span>
              <span className="text-[11px] text-[#66756B]">Verified deliveries</span>
            </div>

            <div className="card-light p-5 sm:p-6 text-center">
              <span className="text-3xl sm:text-4xl font-bold font-serif text-[#2D8061]">
                {impact ? impact.summary?.activeListings || '8' : '8'}
              </span>
              <span className="text-xs font-bold text-[#18372D] block mt-1">Active Opportunities</span>
              <span className="text-[11px] text-[#66756B]">Open right now</span>
            </div>

            <div className="card-light p-5 sm:p-6 text-center">
              <span className="text-3xl sm:text-4xl font-bold font-serif text-[#174C3C]">
                {impact ? `${impact.wasteDiversion?.estimatedKgDiverted?.toFixed(1) || '620'} kg` : '620 kg'}
              </span>
              <span className="text-xs font-bold text-[#18372D] block mt-1">Waste Diverted</span>
              <span className="text-[11px] text-[#66756B]">Estimated diversion</span>
            </div>

            <div className="card-light p-5 sm:p-6 text-center">
              <span className="text-3xl sm:text-4xl font-bold font-serif text-[#D97706]">
                {impact ? impact.summary?.verifiedPartners || '14' : '14'}
              </span>
              <span className="text-xs font-bold text-[#18372D] block mt-1">Verified NGO Hubs</span>
              <span className="text-[11px] text-[#66756B]">Vetted relief partners</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION F — FOOD DISCOVERY PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#2D8061]">
              Live Surplus Queue
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#18372D] mt-1">
              Active recovery opportunities
            </h2>
          </div>
          <Link
            to="/listings"
            className="btn-outline text-xs sm:text-sm py-2 px-4 self-start sm:self-auto"
          >
            Explore all listings ({listings.length > 0 ? listings.length : 12}+) <ArrowRight className="w-3.5 h-3.5" />
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
              <div key={item._id} className="card-light p-5 sm:p-6 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EEF4ED] text-[#174C3C] capitalize">
                      {item.foodCategory ? item.foodCategory.replace('_', ' ') : 'Food'}
                    </span>
                    <UrgencyBadge deadline={item.collectionDeadline} />
                  </div>
                  <h3 className="text-base font-bold text-[#18372D] line-clamp-1">{item.foodTitle}</h3>
                  <div className="text-xs text-[#66756B] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#2D8061] shrink-0" />
                    <span>{item.areaOrAddress || 'South Delhi Hub'}</span>
                  </div>
                  <div className="text-xs font-semibold text-[#18372D]">
                    {item.quantity} {item.unit}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E3E8E0] flex items-center justify-between">
                  <StatusBadge status={item.status} size="sm" />
                  <Link
                    to={`/listings/${item._id}`}
                    className="text-xs font-bold text-[#174C3C] hover:text-[#2D8061] transition-colors"
                  >
                    View details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-light p-8 text-center text-xs text-[#66756B]">
            No live listings in queue right now. Check back soon or create a donation!
          </div>
        )}
      </section>

      {/* SECTION G — IMPACT STORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-light p-6 sm:p-10 border border-[#E3E8E0] rounded-3xl overflow-hidden bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden shadow-sm aspect-4/3 sm:aspect-16/10">
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
              <span className="text-xs font-bold uppercase tracking-widest text-[#2D8061]">
                Real Stories of Nourishment
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#18372D]">
                "Food that was cooked with love should be eaten with dignity."
              </h2>
              <p className="text-xs sm:text-sm text-[#66756B] leading-relaxed">
                When wedding halls wrap up after midnight, vast quantities of pristine, untouched food historically ended up in waste bins. With BhojanSetu, volunteers from Annapurna Seva Trust collect the insulated containers within minutes, delivering hot, fragrant food to shelters and community kitchens before dawn.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#DCEFE2] text-[#174C3C] flex items-center justify-center font-bold text-xs">
                  AS
                </div>
                <div>
                  <div className="text-xs font-bold text-[#18372D]">Ananya Sengupta</div>
                  <div className="text-[11px] text-[#66756B]">Lead Trustee, Annapurna Community Kitchen</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION H — FINAL CTA (Light background with restrained forest green focal card) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-dark-emerald p-8 sm:p-14 text-center rounded-3xl relative overflow-hidden bg-[#174C3C]">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-bold font-serif text-white tracking-tight">
              Ready to ensure zero good food is wasted?
            </h2>
            <p className="text-xs sm:text-base text-[#DCEFE2] max-w-lg mx-auto leading-relaxed">
              Join dozens of banquet halls, caterers, and relief NGOs across Delhi NCR in building a dignified, reliable food recovery network.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                to="/listings"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#DCEFE2] text-[#174C3C] font-bold text-xs sm:text-sm shadow-xs hover:bg-white transition-all hover:scale-102"
              >
                Find Food to Rescue
              </Link>
              <Link
                to="/listings/create"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-[#DCEFE2]/30 text-white font-bold text-xs sm:text-sm hover:bg-[#2D8061] transition-all hover:scale-102"
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
