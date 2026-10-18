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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      {/* Header */}
      <div className="space-y-2 pb-6 border-b border-[#E3E8E0]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCEFE2] text-[#174C3C] text-xs font-bold border border-[#E3E8E0]">
          <ShieldCheck className="w-4 h-4 text-[#2D8061]" />
          Operating Standards &amp; Protocol
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-[#18372D] tracking-tight">
          Food Safety &amp; Recovery Guidelines
        </h1>
        <p className="text-sm sm:text-base text-[#66756B] leading-relaxed max-w-3xl">
          Guidelines and operational protocol boundaries for event organizers, banquet caterers, and recovery partners
          coordinating food surplus across India.
        </p>
      </div>

      {/* Mandatory Platform Disclaimer */}
      <div className="bg-[#EEF4ED] border border-[#E3E8E0] rounded-3xl p-6 sm:p-8 space-y-3 shadow-2xs">
        <div className="flex items-center gap-2 text-[#18372D] font-bold text-base">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
          Mandatory Coordination &amp; Non-Certification Notice
        </div>
        <p className="text-sm text-[#18372D] leading-relaxed font-serif italic text-base">
          &ldquo;BhojanSetu supports coordination only. Food suitability must be assessed by responsible
          people before collection and distribution. Follow applicable food-safety requirements, proper
          storage and handling, and physical inspection. A platform status does not certify food as safe.&rdquo;
        </p>
        <p className="text-xs text-[#66756B] leading-relaxed">
          The platform operates as a coordination and traceability bridge between event surplus and
          recovery teams. We do not inspect food on-site, test microbiological parameters, or provide legal
          food-safety guarantees. Physical sensory inspection and temperature checks by authorized food handlers
          remain strictly mandatory.
        </p>
      </div>

      {/* 4 Pillars of Surplus Food Handling */}
      <div className="space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-[#174C3C]">Hygiene Principles</span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#18372D]">
            Core Handling Guidelines for Event Surplus
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pillar 1: Thermal Control */}
          <div className="card-light p-6 sm:p-7 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#DCEFE2] text-[#174C3C] flex items-center justify-center font-bold">
              <Thermometer className="w-5 h-5 text-[#2D8061]" />
            </div>
            <h3 className="font-bold text-[#18372D] text-base font-serif">1. Thermal Control (Temperature)</h3>
            <p className="text-xs sm:text-sm text-[#66756B] leading-relaxed">
              Cooked meals must remain outside the danger zone (5°C to 65°C):
            </p>
            <ul className="text-xs text-[#18372D] space-y-2 pt-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2D8061] shrink-0 mt-0.5" />
                <span>
                  <strong>Hot holding:</strong> Maintained consistently above <strong>65°C</strong> in covered chafing warmers.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2D8061] shrink-0 mt-0.5" />
                <span>
                  <strong>Cold holding / refrigeration:</strong> Chilled below <strong>5°C</strong> immediately if intended for later redistribution.
                </span>
              </li>
            </ul>
          </div>

          {/* Pillar 2: The 2-to-4 Hour Window */}
          <div className="card-light p-6 sm:p-7 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#DCEFE2] text-[#174C3C] flex items-center justify-center font-bold">
              <Clock className="w-5 h-5 text-[#2D8061]" />
            </div>
            <h3 className="font-bold text-[#18372D] text-base font-serif">2. Time Windows &amp; Cut-Offs</h3>
            <p className="text-xs sm:text-sm text-[#66756B] leading-relaxed">
              Timeliness is paramount for perishable banquet surplus:
            </p>
            <ul className="text-xs text-[#18372D] space-y-2 pt-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2D8061] shrink-0 mt-0.5" />
                <span>
                  <strong>Buffet Surplus:</strong> Cooked food held ambiently must be collected within <strong>2 to 3 hours</strong> maximum.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2D8061] shrink-0 mt-0.5" />
                <span>
                  <strong>Automatic Expiry:</strong> Listings not claimed within their assigned window are automatically expired.
                </span>
              </li>
            </ul>
          </div>

          {/* Pillar 3: Organoleptic Inspection */}
          <div className="card-light p-6 sm:p-7 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#DCEFE2] text-[#174C3C] flex items-center justify-center font-bold">
              <Eye className="w-5 h-5 text-[#2D8061]" />
            </div>
            <h3 className="font-bold text-[#18372D] text-base font-serif">3. Sensory &amp; Physical Check</h3>
            <p className="text-xs sm:text-sm text-[#66756B] leading-relaxed">
              Software status never replaces on-site human judgment:
            </p>
            <ul className="text-xs text-[#18372D] space-y-2 pt-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2D8061] shrink-0 mt-0.5" />
                <span>
                  <strong>Visual check:</strong> Inspect for color change, moisture condensation, or foreign objects.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2D8061] shrink-0 mt-0.5" />
                <span>
                  <strong>Olfactory check:</strong> Any off-odor, fermentation scent, or sour aroma requires immediate rejection.
                </span>
              </li>
            </ul>
          </div>

          {/* Pillar 4: Packaging & Transport */}
          <div className="card-light p-6 sm:p-7 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#DCEFE2] text-[#174C3C] flex items-center justify-center font-bold">
              <Package className="w-5 h-5 text-[#2D8061]" />
            </div>
            <h3 className="font-bold text-[#18372D] text-base font-serif">4. Packaging &amp; Transit Hygiene</h3>
            <p className="text-xs sm:text-sm text-[#66756B] leading-relaxed">
              Protection throughout transportation:
            </p>
            <ul className="text-xs text-[#18372D] space-y-2 pt-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2D8061] shrink-0 mt-0.5" />
                <span>
                  <strong>Food-grade containers:</strong> Stainless steel catering trays, food-safe foil covers, or sealed disposable boxes.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2D8061] shrink-0 mt-0.5" />
                <span>
                  <strong>Insulated transport:</strong> Thermal delivery bags or insulated iceboxes required during transit.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
