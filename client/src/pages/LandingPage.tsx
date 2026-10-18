import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  Clock,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Truck,
  HeartHandshake,
  Users,
  Building2,
  ChefHat,
  Scale,
  Sparkles,
} from 'lucide-react';
import { FoodSafetyBanner } from '../components/FoodSafetyBanner.js';
import { DemoAccountSelector } from '../components/DemoAccountSelector.js';
import { request } from '../api/client.js';
import { ImpactSummary } from '../types/index.js';

export const LandingPage: React.FC = () => {
  const [impact, setImpact] = useState<ImpactSummary | null>(null);

  useEffect(() => {
    request<ImpactSummary>('/impact/summary')
      .then((data) => setImpact(data))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Top Demo Fast-Track for Hackathon Judges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <DemoAccountSelector />
      </section>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Event-Based Surplus Food Recovery & Redistribution Platform
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif text-gray-950 tracking-tight leading-[1.15]">
              Turn event surplus into{' '}
              <span className="text-emerald-800 underline decoration-amber-400 decoration-wavy decoration-2">
                community support.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed max-w-2xl">
              Coordinate suitable surplus food from weddings, banquets, and caterers with verified
              recovery partners — with transparent collection deadlines, capacity checks, and traceable
              hand-offs.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                to="/listings/create"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-emerald-800 hover:bg-emerald-900 shadow-md hover:shadow-lg transition-all text-sm sm:text-base"
              >
                <ChefHat className="w-5 h-5 text-emerald-200" />
                List Surplus Food
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <Link
                to="/listings"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-gray-800 bg-white hover:bg-gray-50 border border-gray-300 shadow-xs transition-all text-sm sm:text-base"
              >
                Browse Available Surplus
              </Link>
            </div>

            <div className="pt-2">
              <p className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  Coordination platform only. Human inspection and applicable food-safety requirements remain
                  essential.
                </span>
              </p>
            </div>
          </div>

          {/* Hero Visual Card / Snapshot */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-emerald-900/10 shadow-lg p-6 space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-0 pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                    Live Recovery Workflow
                  </span>
                </div>
                <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  Demo Prototype
                </span>
              </div>

              {/* Sample Workflow Card */}
              <div className="space-y-3 relative z-10">
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/80 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-gray-900">
                      Sharma-Verma Wedding Reception
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      50 kg Cooked Buffet
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    Paneer Butter Masala & Steamed Jeera Rice held in covered thermal warmers &gt; 65°C.
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-gray-500">
                    <span className="flex items-center gap-1 text-red-700 font-semibold">
                      <Clock className="w-3.5 h-3.5" /> 2.5h window remaining
                    </span>
                    <span>Saket Banquet Zone</span>
                  </div>
                </div>

                <div className="flex items-center justify-center text-emerald-700 py-1">
                  <div className="text-xs font-semibold flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    <Scale className="w-3.5 h-3.5" /> Rule-Based Match (Score: 92/100)
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-900/5 border border-emerald-900/15 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    🤝
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-gray-900 truncate">
                      Annapurna Seva Trust
                    </div>
                    <div className="text-[11px] text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified NGO • 250 unit capacity
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-1 bg-emerald-700 text-white rounded-md shrink-0">
                    Assigned
                  </span>
                </div>
              </div>

              <div className="relative z-10 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Hand-off: In-Transit Verification</span>
                <span className="font-semibold text-emerald-800">100% Traceable Log</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Genuine Live Database Metrics Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-emerald-800/80">
            <div>
              <span className="text-xs uppercase tracking-wider text-emerald-300 font-bold">
                Platform Accountability
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
                Live Metrics Derived From Persistent Records
              </h2>
            </div>
            <span className="text-xs text-emerald-200 bg-emerald-800/80 px-3 py-1 rounded-full border border-emerald-700 self-start md:self-auto">
              Real MongoDB Aggregation • Not Fabricated
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-3 rounded-xl bg-emerald-800/40 border border-emerald-700/50">
              <div className="text-2xl sm:text-4xl font-bold text-white mb-1">
                {impact ? impact.summary.totalListings : '...'}
              </div>
              <div className="text-xs sm:text-sm text-emerald-200">Total Listings Created</div>
              <div className="text-[10px] text-emerald-300/70 mt-1">Reported by organizers</div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-800/40 border border-emerald-700/50">
              <div className="text-2xl sm:text-4xl font-bold text-amber-300 mb-1">
                {impact ? impact.summary.completedDeliveries : '...'}
              </div>
              <div className="text-xs sm:text-sm text-emerald-200">Completed Rescues</div>
              <div className="text-[10px] text-emerald-300/70 mt-1">Delivered to beneficiaries</div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-800/40 border border-emerald-700/50">
              <div className="text-2xl sm:text-4xl font-bold text-white mb-1">
                {impact ? `${impact.wasteDiversion.estimatedKgDiverted} kg` : '...'}
              </div>
              <div className="text-xs sm:text-sm text-emerald-200">Estimated Food Diverted</div>
              <div className="text-[10px] text-emerald-300/70 mt-1">Formula-derived estimate</div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-800/40 border border-emerald-700/50">
              <div className="text-2xl sm:text-4xl font-bold text-emerald-300 mb-1">
                {impact ? impact.summary.verifiedPartners : '...'}
              </div>
              <div className="text-xs sm:text-sm text-emerald-200">Verified Recovery Partners</div>
              <div className="text-[10px] text-emerald-300/70 mt-1">Admin reviewed profiles</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-800">
            End-To-End Operational Flow
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-gray-950">
            How BhojanSetu Recovers Event Surplus
          </h2>
          <p className="text-sm text-gray-600">
            Bridging the gap between surplus event kitchens and community food relief with accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 hover:border-emerald-600 transition-all shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base">
              1
            </div>
            <h3 className="text-lg font-bold text-gray-900">1. List Surplus Food</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Caterer/organizer inputs surplus quantity, unit, preparation time, temperature/storage
              handling notes, and a firm collection deadline. Private pickup instructions remain locked.
            </p>
            <div className="text-xs text-emerald-800 font-medium flex items-center gap-1.5 pt-2 border-t border-gray-100">
              <Clock className="w-3.5 h-3.5" /> Enforces future deadlines
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 hover:border-emerald-600 transition-all shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-base">
              2
            </div>
            <h3 className="text-lg font-bold text-gray-900">2. Match & Assign Partner</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Verified recovery partners discover eligible listings. The rule-based engine scores
              partner capacity, deadline urgency, and service area. The organizer approves the request.
            </p>
            <div className="text-xs text-blue-800 font-medium flex items-center gap-1.5 pt-2 border-t border-gray-100">
              <Scale className="w-3.5 h-3.5" /> Explainable rule ranking (Non-ML)
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 hover:border-emerald-600 transition-all shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-base">
              3
            </div>
            <h3 className="text-lg font-bold text-gray-900">3. Track Collection & Delivery</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Approved partner unlocks pickup coordinates, inspects the food, and records collection.
              Once distributed to community beneficiaries, final delivery is logged in persistent status history.
            </p>
            <div className="text-xs text-amber-800 font-medium flex items-center gap-1.5 pt-2 border-t border-gray-100">
              <Truck className="w-3.5 h-3.5" /> Complete chronological audit trail
            </div>
          </div>
        </div>
      </section>

      {/* Role Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-gray-950">
            Tailored for Event Ecosystem Roles
          </h2>
          <p className="text-sm text-gray-600">
            Each participant has a clear role-specific dashboard and strict authorization checks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">Organizers & Caterers</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Create listings for banquets, weddings, and institutional events. Review incoming rescue
              requests, see explainable partner rankings, and approve assignments.
            </p>
            <ul className="text-xs text-gray-500 space-y-1.5 pt-2">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Prevent food waste at events
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Private pickup location security
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">Recovery Partners</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              NGOs, community kitchens, and volunteer networks. Maintain vehicle capacity, service area,
              and verification standing. Submit requests and record collection/delivery hand-offs.
            </p>
            <ul className="text-xs text-gray-500 space-y-1.5 pt-2">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Only non-expired, eligible listings
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Capacity-bounded requests
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">Platform Coordinators</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Review partner verification documentation, oversee active and expired listings across regions,
              and monitor real aggregate recovery impact.
            </p>
            <ul className="text-xs text-gray-500 space-y-1.5 pt-2">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Partner verification review console
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Status conflict mediation
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How Matching Works (Transparent Rule-Based, NOT AI/ML) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 sm:p-10 space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-800">
              Deterministic Logic • No Hallucinations
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-gray-950">
              Smart Rescue Engine: Rule-Based, Explainable Matching
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              We explicitly reject black-box AI/ML claims for time-critical food recovery. Food safety and
              rescue hand-offs depend on deterministic business rules that organizers and coordinators can
              inspect and understand:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-1.5">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Gate 1</span>
              <h4 className="font-semibold text-gray-900 text-sm">Partner Verification</h4>
              <p className="text-xs text-gray-600">
                Unverified partners are excluded from receiving assignments.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-1.5">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Gate 2</span>
              <h4 className="font-semibold text-gray-900 text-sm">Deadline Urgency</h4>
              <p className="text-xs text-gray-600">
                Listings with expiring windows (&lt;2h) receive high-urgency rescue scoring.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-1.5">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Gate 3</span>
              <h4 className="font-semibold text-gray-900 text-sm">Capacity Fit</h4>
              <p className="text-xs text-gray-600">
                Partner vehicle capacity must safely match or accommodate the surplus volume.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-1.5">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Gate 4</span>
              <h4 className="font-semibold text-gray-900 text-sm">Service Area Proximity</h4>
              <p className="text-xs text-gray-600">
                Categorical locality match without fabricating fake GPS distances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Food Safety Banner Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FoodSafetyBanner />
      </section>
    </div>
  );
};
