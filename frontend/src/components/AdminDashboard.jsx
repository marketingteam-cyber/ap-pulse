import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  MapPin,
  Clock,
  Eye,
  EyeOff,
  Activity,
  Flame,
  ArrowRight,
  Users,
  Zap,
} from 'lucide-react';
import { fetchHeatmap } from '../utils/api';

export default function AdminDashboard({ showHeatmap, setShowHeatmap, graphData }) {
  const [heatmapData, setHeatmapData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeatmap().then(data => {
      setHeatmapData(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-8">
        <div className="flex items-center justify-center text-slate-400">
          <Activity className="w-5 h-5 animate-pulse mr-2" />
          Loading analytics...
        </div>
      </div>
    );
  }

  const zones = heatmapData?.zones || {};
  const mostUsedPaths = heatmapData?.mostUsedPaths || [];

  // Sort zones by traffic
  const topZones = Object.entries(zones)
    .map(([id, data]) => ({ id, ...data, label: graphData?.nodes?.[id]?.label || id }))
    .sort((a, b) => b.traffic - a.traffic)
    .slice(0, 8);

  const getTrafficColor = (traffic) => {
    if (traffic >= 80) return { bg: 'bg-red-100', text: 'text-red-700', bar: 'bg-red-500' };
    if (traffic >= 60) return { bg: 'bg-amber-100', text: 'text-amber-700', bar: 'bg-amber-500' };
    if (traffic >= 40) return { bg: 'bg-blue-100', text: 'text-blue-700', bar: 'bg-brand-blue' };
    return { bg: 'bg-slate-100', text: 'text-slate-600', bar: 'bg-slate-400' };
  };

  const totalTraffic = Object.values(zones).reduce((sum, z) => sum + z.traffic, 0);
  const avgTraffic = Math.round(totalTraffic / Object.keys(zones).length);
  const peakZone = topZones[0];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-white">
              <BarChart3 className="w-5 h-5" />
              <h2 className="font-bold text-base">Admin Analytics</h2>
            </div>
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                showHeatmap
                  ? 'bg-brand-red text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {showHeatmap ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-px bg-surface-200">
          <div className="bg-white p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Activity className="w-3.5 h-3.5 text-brand-blue" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{avgTraffic}%</div>
            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Avg Traffic</div>
          </div>
          <div className="bg-white p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Flame className="w-3.5 h-3.5 text-brand-red" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{peakZone?.label}</div>
            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Hottest Zone</div>
          </div>
          <div className="bg-white p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="w-3.5 h-3.5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{Object.keys(zones).length}</div>
            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Active Zones</div>
          </div>
        </div>
      </div>

      {/* High Traffic Zones */}
      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-surface-200">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-brand-red" />
            <h3 className="text-sm font-bold text-slate-700">High Traffic Zones</h3>
          </div>
        </div>
        <div className="p-4 space-y-2.5">
          {topZones.map(zone => {
            const colors = getTrafficColor(zone.traffic);
            return (
              <div key={zone.id} className="group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-600">{zone.label}</span>
                  <span className={`text-xs font-bold ${colors.text}`}>{zone.traffic}%</span>
                </div>
                <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${colors.bar} rounded-full transition-all duration-700`}
                    style={{ width: `${zone.traffic}%` }}
                  />
                </div>
                <div className="flex gap-1 mt-1">
                  {zone.peakHours.map((h, i) => (
                    <span key={i} className="text-[9px] text-slate-400 bg-surface-50 px-1.5 py-0.5 rounded">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Most Used Paths */}
      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-surface-200">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-blue" />
            <h3 className="text-sm font-bold text-slate-700">Most Used Paths</h3>
          </div>
        </div>
        <div className="divide-y divide-surface-100">
          {mostUsedPaths.map((path, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-surface-50 transition-colors">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold">
                {i + 1}
              </div>
              <div className="flex-1 flex items-center gap-1.5 min-w-0">
                <span className="text-xs font-medium text-slate-600 truncate">
                  {graphData?.nodes?.[path.from]?.label || path.from}
                </span>
                <ArrowRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span className="text-xs font-medium text-slate-600 truncate">
                  {graphData?.nodes?.[path.to]?.label || path.to}
                </span>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs font-bold text-slate-700">{path.usage}</div>
                <div className="flex items-center gap-0.5 text-[10px] text-slate-400">
                  <Clock className="w-2.5 h-2.5" />
                  {path.avgTime}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
