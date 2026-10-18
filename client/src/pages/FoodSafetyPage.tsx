import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Thermometer,
  Clock,
  Eye,
  CheckCircle2,
  Package,
  FileCheck,
} from 'lucide-react';

export const FoodSafetyPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="space-y-2 pb-6 border-b border-gray-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          Operating Standards & Protocol
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-gray-950">
          Food Safety & Surplus Recovery Guidelines
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-3xl">
          Guidelines and protocol boundaries for event organizers, caterers, and recovery partners
          coordinating food surplus in India.
        </p>
      </div>

      {/* Mandatory Platform Disclaimer */}
      <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-6 sm:p-7 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-amber-950 font-bold text-base">
          <AlertTriangle className="w-5 h-5 text-amber-700" />
          Mandatory Coordination & Non-Certification Notice
        </div>
        <p className="text-sm text-amber-900 leading-relaxed font-medium">
          “BhojanSetu supports coordination only. Food suitability must be assessed by responsible
          people before collection and distribution. Follow applicable food-safety requirements, proper
          storage and handling, and physical inspection. A platform status does not certify food as safe.”
        </p>
        <p className="text-xs text-amber-800 leading-relaxed">
          The platform operates as a coordination and traceability bridge between event surplus and
          recovery teams. We do not inspect food on-site, test microbiological parameters, or provide legal
          food-safety guarantees. Physical sensory inspection and temperature checks by authorized food handlers
          remain strictly mandatory.
        </p>
      </div>

      {/* 4 Pillars of Surplus Food Handling */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold font-serif text-gray-900">
          Core Handling Guidelines for Event Surplus
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pillar 1: Thermal Control */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-800 flex items-center justify-center">
              <Thermometer className="w-5 h-5 text-red-700" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">1. Thermal Control (Temperature)</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Cooked meals must remain outside the danger zone (5°C to 65°C):
            </p>
            <ul className="text-xs text-gray-700 space-y-1.5 pt-1">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Hot holding:</strong> Maintained consistently above <strong>65°C</strong> in covered chafing warmers.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Cold holding / refrigeration:</strong> Chilled below <strong>5°C</strong> immediately if intended for later redistribution.
                </span>
              </li>
            </ul>
          </div>

          {/* Pillar 2: The 2-to-4 Hour Window */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">2. Time Windows & Cut-Offs</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Timeliness is paramount for perishable banquet surplus:
            </p>
            <ul className="text-xs text-gray-700 space-y-1.5 pt-1">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Buffet Surplus:</strong> Cooked food held ambiently must be collected within <strong>2 to 3 hours</strong> maximum.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Automatic Expiration:</strong> Listings past their deadline are automatically marked expired on BhojanSetu and cannot be requested.
                </span>
              </li>
            </ul>
          </div>

          {/* Pillar 3: Physical Sensory Inspection */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-700" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">3. Physical Sensory Check</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Recovery volunteers and drivers must perform a mandatory sight-and-smell check upon arrival:
            </p>
            <ul className="text-xs text-gray-700 space-y-1.5 pt-1">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <span>Verify that food was completely untouched by guests (buffet back-kitchen reserve).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <span>Reject any food exhibiting off-odors, surface discoloration, or condensation pooling.</span>
              </li>
            </ul>
          </div>

          {/* Pillar 4: Food-Grade Transport */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-700" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">4. Transport & Packaging</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Safe transit requires designated, hygienic transport equipment:
            </p>
            <ul className="text-xs text-gray-700 space-y-1.5 pt-1">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <span>Use stainless-steel food-grade containers or insulated thermal food transport bags.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <span>Keep containers sealed tight throughout transit to prevent external contamination.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Organizer & Partner Responsibilities Matrix */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-xl font-bold font-serif text-gray-900">
          Responsibility Hand-Off Checklist
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm">
          <div className="space-y-3">
            <h3 className="font-bold text-emerald-900 uppercase tracking-wider text-xs">
              Organizer / Caterer Checklist
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Accurately input preparation timestamp and holding temperature.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Disclose potential allergens (dairy, nuts, gluten) where known.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Set realistic collection deadlines based on holding limits.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Provide clear, secure loading dock directions in private pickup instructions.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-blue-900 uppercase tracking-wider text-xs">
              Recovery Partner Checklist
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>Maintain registered volunteer hygiene standards and vehicle cleanliness.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>Do not request volumes larger than vehicle capacity.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>Inspect condition on-site and record collection timestamp.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>Distribute promptly to verified community shelters or community kitchens.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
