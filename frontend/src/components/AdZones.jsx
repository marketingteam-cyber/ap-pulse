import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  MapPin,
  Eye,
  MousePointerClick,
  ExternalLink,
  Plus,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { fetchAds } from '../utils/api';

export default function AdZones({ graphData }) {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedAd, setExpandedAd] = useState(null);

  useEffect(() => {
    fetchAds().then(data => {
      setAds(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-8 text-center text-slate-400 text-sm">
        Loading ad zones...
      </div>
    );
  }

  const totalImpressions = ads.reduce((s, a) => s + a.impressions, 0);
  const totalClicks = ads.reduce((s, a) => s + a.clicks, 0);
  const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-4">
          <div className="flex items-center gap-2.5 text-white">
            <Megaphone className="w-5 h-5" />
            <div>
              <h2 className="font-bold text-base">Ad Placement Zones</h2>
              <p className="text-white/80 text-xs mt-0.5">Manage promotional content across the office</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-px bg-surface-200">
          <div className="bg-white p-4 text-center">
            <div className="text-xl font-bold text-slate-800">{ads.length}</div>
            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Active Zones</div>
          </div>
          <div className="bg-white p-4 text-center">
            <div className="text-xl font-bold text-slate-800">{totalImpressions.toLocaleString()}</div>
            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Impressions</div>
          </div>
          <div className="bg-white p-4 text-center">
            <div className="text-xl font-bold text-slate-800">{avgCTR}%</div>
            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Avg CTR</div>
          </div>
        </div>
      </div>

      {/* Ad Cards */}
      <div className="space-y-3">
        {ads.map(ad => {
          const isExpanded = expandedAd === ad.id;
          const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : 0;
          const zoneName = graphData?.nodes?.[ad.zone]?.label || ad.zone;

          return (
            <div
              key={ad.id}
              className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden transition-all"
            >
              <button
                onClick={() => setExpandedAd(isExpanded ? null : ad.id)}
                className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-surface-50 transition-colors text-left"
              >
                <div className={`p-2 rounded-xl ${ad.content.type === 'sponsor' ? 'bg-purple-100' : 'bg-amber-100'}`}>
                  {ad.content.type === 'sponsor'
                    ? <Sparkles className="w-4 h-4 text-purple-600" />
                    : <Megaphone className="w-4 h-4 text-amber-600" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-700 truncate">{ad.content.title}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-400">{zoneName}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      ad.content.type === 'sponsor' ? 'bg-purple-100 text-purple-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {ad.content.type === 'sponsor' ? 'SPONSORED' : 'INTERNAL'}
                    </span>
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {isExpanded && (
                <div className="px-5 pb-4 border-t border-surface-100 pt-3 animate-fade-in">
                  {/* Ad Preview */}
                  <div className="bg-gradient-to-r from-surface-50 to-surface-100 rounded-xl p-4 mb-3 border border-dashed border-surface-300">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Ad Preview</div>
                    <div className="bg-white rounded-lg p-3 shadow-sm border border-surface-200">
                      <div className="text-sm font-bold text-slate-800">{ad.content.title}</div>
                      <p className="text-xs text-slate-500 mt-1">{ad.content.description}</p>
                      <button className="mt-2 text-xs font-semibold text-brand-blue hover:underline flex items-center gap-1">
                        {ad.content.cta} <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Performance */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-surface-50 rounded-lg p-2.5 text-center">
                      <div className="flex items-center justify-center gap-1 mb-0.5">
                        <Eye className="w-3 h-3 text-slate-400" />
                      </div>
                      <div className="text-sm font-bold text-slate-700">{ad.impressions.toLocaleString()}</div>
                      <div className="text-[9px] text-slate-400">Impressions</div>
                    </div>
                    <div className="bg-surface-50 rounded-lg p-2.5 text-center">
                      <div className="flex items-center justify-center gap-1 mb-0.5">
                        <MousePointerClick className="w-3 h-3 text-slate-400" />
                      </div>
                      <div className="text-sm font-bold text-slate-700">{ad.clicks}</div>
                      <div className="text-[9px] text-slate-400">Clicks</div>
                    </div>
                    <div className="bg-surface-50 rounded-lg p-2.5 text-center">
                      <div className="text-sm font-bold text-green-600">{ctr}%</div>
                      <div className="text-[9px] text-slate-400">CTR</div>
                    </div>
                  </div>

                  {/* Zone info */}
                  <div className="mt-3 text-xs text-slate-400">
                    Size: {ad.size.width}×{ad.size.height}px &bull; Position: ({ad.position.x}, {ad.position.y})
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Zone CTA */}
      <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border-2 border-dashed border-surface-300 text-slate-400 hover:text-slate-600 hover:border-slate-400 transition-all">
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">Add New Ad Zone</span>
      </button>
    </div>
  );
}
