import React, { useEffect, useState } from 'react';
import { request } from '../api/client.js';
import { ImpactSummary } from '../types/index.js';
import { LoadingSpinner } from '../components/LoadingSpinner.js';
import { ErrorAlert } from '../components/ErrorAlert.js';
import { FoodSafetyBanner } from '../components/FoodSafetyBanner.js';
import {
  BarChart3,
  TrendingUp,
  PackageCheck,
  Scale,
  Building2,
  HeartHandshake,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export const ImpactPage: React.FC = () => {
  const [impact, setImpact] = useState<ImpactSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchImpact();
  }, []);

  const fetchImpact = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await request<ImpactSummary>('/impact/summary');
      setImpact(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch impact metrics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16">
        <LoadingSpinner message="Calculating real-time persistent impact metrics..." size="lg" />
      </div>
    );
  }

  if (error || !impact) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorAlert message={error || 'Failed to load impact data'} onRetry={fetchImpact} />
      </div>
    );
  }

  // Prepare chart data from genuine DB breakdown
  const statusChartData = [
    { name: 'Open', count: impact.statusBreakdown['open'] || 0, color: '#10b981' },
    { name: 'Under Review', count: impact.statusBreakdown['requested'] || 0, color: '#f59e0b' },
    { name: 'Assigned', count: impact.statusBreakdown['assigned'] || 0, color: '#3b82f6' },
    { name: 'In Transit', count: impact.statusBreakdown['collected'] || 0, color: '#6366f1' },
    { name: 'Delivered', count: impact.statusBreakdown['delivered'] || 0, color: '#047857' },
    {
      name: 'Expired/Cancelled',
      count: (impact.statusBreakdown['expired'] || 0) + (impact.statusBreakdown['cancelled'] || 0),
      color: '#9ca3af',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
            Transparent Accountability
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            Live MongoDB Aggregation
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-gray-950 flex items-center gap-2.5">
          <BarChart3 className="w-7 h-7 text-emerald-800" />
          Verified Surplus Recovery Impact
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-2xl">
          All numbers are dynamically computed from stored database records. We report user-entered
          quantities with unit fidelity and separate estimates from measured figures.
        </p>
      </div>

      <FoodSafetyBanner compact />

      {/* Top Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Total Listings Created
          </div>
          <div className="text-3xl font-bold text-gray-950 mt-2">
            {impact.summary.totalListings}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">Reported by event organizers</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Completed Rescues
          </div>
          <div className="text-3xl font-bold text-emerald-800 mt-2">
            {impact.summary.completedDeliveries}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 font-medium">
            Delivered to community centers
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Estimated Waste Diverted
          </div>
          <div className="text-3xl font-bold text-emerald-900 mt-2">
            {impact.wasteDiversion.estimatedKgDiverted} kg
          </div>
          <div className="text-[11px] text-gray-500 mt-1">Formula-derived estimate</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Verified Partners
          </div>
          <div className="text-3xl font-bold text-blue-800 mt-2">
            {impact.summary.verifiedPartners}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">Active standing NGOs</div>
        </div>
      </div>

      {/* Explanatory Formula Banner */}
      <div className="p-4 sm:p-5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-800 space-y-1.5">
        <div className="font-bold text-stone-900 flex items-center gap-2">
          <Scale className="w-4 h-4 text-emerald-800" />
          Transparent Diversion Calculation Methodology
        </div>
        <p className="text-xs text-stone-600 leading-relaxed">
          {impact.wasteDiversion.formulaExplanation}
        </p>
        <div className="text-[11px] text-stone-500">
          * Note: Environmental and carbon footprint reduction figures are marked "To be measured in pilot" and are not artificially simulated.
        </div>
      </div>

      {/* Breakdown by Units (Preserves Unit Fidelity) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Offered by Unit */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-gray-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800">
              Reported Quantity Offered (By Unit)
            </h2>
            <p className="text-xs text-gray-500">
              Total volume published by organizers across different metric units.
            </p>
          </div>

          <div className="space-y-3">
            {impact.offeredByUnit.map((item) => (
              <div
                key={item.unit}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100"
              >
                <div>
                  <span className="font-bold text-sm text-gray-900 capitalize">
                    {item.unit.replace('_', ' ')}
                  </span>
                  <div className="text-[11px] text-gray-500">
                    From {item.listingsCount} event listing{item.listingsCount > 1 ? 's' : ''}
                  </div>
                </div>
                <div className="text-lg font-bold text-emerald-900">
                  {item.quantity} <span className="text-xs font-normal text-gray-600">{item.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Collected by Unit */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-gray-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800">
              Reported Quantity Rescued (Collected & Delivered)
            </h2>
            <p className="text-xs text-gray-500">
              Verified physical hand-offs completed by recovery partners.
            </p>
          </div>

          <div className="space-y-3">
            {impact.collectedByUnit.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-500">
                No collections logged yet. Complete a rescue run to see rescued quantities here.
              </div>
            ) : (
              impact.collectedByUnit.map((item) => (
                <div
                  key={item.unit}
                  className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 border border-emerald-100"
                >
                  <div>
                    <span className="font-bold text-sm text-emerald-950 capitalize">
                      {item.unit.replace('_', ' ')}
                    </span>
                    <div className="text-[11px] text-emerald-700">
                      Rescued from {item.listingsCount} listing{item.listingsCount > 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="text-lg font-bold text-emerald-800">
                    {item.quantity} <span className="text-xs font-normal text-gray-600">{item.unit}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recharts Bar Chart: Listing Status Breakdown */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="pb-3 border-b border-gray-100">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800">
            Listings Breakdown by Operational Status
          </h2>
          <p className="text-xs text-gray-500">
            Live lifecycle stage distribution of all surplus batches in the database.
          </p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {statusChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Timeline from DB */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="pb-3 border-b border-gray-100">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800">
            Recent Rescue Hand-Off Feed
          </h2>
          <p className="text-xs text-gray-500">
            Audit feed of actual requests and hand-offs recorded by platform participants.
          </p>
        </div>

        {impact.recentActivity.length === 0 ? (
          <div className="p-4 text-center text-xs text-gray-500">No recent activity found.</div>
        ) : (
          <div className="space-y-2">
            {impact.recentActivity.map((act) => (
              <div
                key={act.id}
                className="p-3.5 rounded-xl bg-gray-50 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-gray-900">
                    {act.partnerName} • <span className="capitalize font-normal">{act.status}</span>
                  </div>
                  <div className="text-gray-500 text-[11px]">
                    {act.foodTitle} ({act.requestedQuantity} {act.unit}) from {act.eventName}
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 font-medium">
                  {new Date(act.updatedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
