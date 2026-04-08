import React, { useState, useMemo } from 'react';
import {
  Navigation,
  MapPin,
  ArrowRight,
  Clock,
  Route,
  RotateCcw,
  MousePointerClick,
  ArrowRightLeft,
} from 'lucide-react';

export default function NavigationPanel({
  graphData,
  onNavigate,
  pathResult,
  onClear,
  startNode,
  endNode,
  setStartNode,
  setEndNode,
  navMode,
  setNavMode,
}) {
  const locations = useMemo(() => {
    if (!graphData?.nodes) return [];
    return Object.entries(graphData.nodes)
      .map(([id, node]) => ({ id, label: node.label, type: node.type }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [graphData]);

  const handleNavigate = () => {
    if (startNode && endNode && startNode !== endNode) {
      onNavigate(startNode, endNode);
    }
  };

  const handleSwap = () => {
    const temp = startNode;
    setStartNode(endNode);
    setEndNode(temp);
  };

  const handleClear = () => {
    setStartNode('');
    setEndNode('');
    onClear();
  };

  return (
    <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-blue to-brand-blue-dark px-5 py-4">
        <div className="flex items-center gap-2.5 text-white">
          <Navigation className="w-5 h-5" />
          <h2 className="font-bold text-base">Navigation</h2>
        </div>
        <p className="text-blue-200 text-xs mt-1">Find the fastest route to your destination</p>
      </div>

      <div className="p-5 space-y-4">
        {/* Map click mode toggle */}
        <button
          onClick={() => setNavMode(!navMode)}
          className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
            navMode
              ? 'bg-brand-blue text-white shadow-sm'
              : 'bg-surface-100 text-slate-600 hover:bg-surface-200'
          }`}
        >
          <MousePointerClick className="w-3.5 h-3.5" />
          {navMode ? 'Click nodes on map to set route' : 'Enable click-to-navigate'}
        </button>

        {/* Start / End selectors */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              Start Location
            </label>
            <select
              value={startNode}
              onChange={(e) => setStartNode(e.target.value)}
              className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2.5 bg-surface-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
            >
              <option value="">Select start point...</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.label}</option>
              ))}
            </select>
          </div>

          {/* Swap button */}
          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              className="p-1.5 rounded-lg bg-surface-100 hover:bg-surface-200 text-slate-400 hover:text-slate-600 transition-all"
              title="Swap start and end"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              Destination
            </label>
            <select
              value={endNode}
              onChange={(e) => setEndNode(e.target.value)}
              className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2.5 bg-surface-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
            >
              <option value="">Select destination...</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleNavigate}
            disabled={!startNode || !endNode || startNode === endNode}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-blue text-white font-semibold text-sm hover:bg-brand-blue-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
          >
            <Route className="w-4 h-4" />
            Find Route
          </button>
          {pathResult && (
            <button
              onClick={handleClear}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-surface-100 text-slate-600 font-medium text-sm hover:bg-surface-200 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Result */}
        {pathResult && (
          <div className="animate-slide-up bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-brand-blue/10 p-1.5 rounded-lg">
                <Route className="w-4 h-4 text-brand-blue" />
              </div>
              <span className="text-sm font-bold text-brand-blue-dark">Route Found</span>
            </div>

            {/* Path visualization */}
            <div className="flex flex-wrap items-center gap-1 mb-3">
              {pathResult.path.map((nodeId, i) => (
                <React.Fragment key={nodeId}>
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ${
                    i === 0
                      ? 'bg-green-100 text-green-700'
                      : i === pathResult.path.length - 1
                        ? 'bg-red-100 text-red-700'
                        : 'bg-white text-slate-600'
                  } shadow-sm`}>
                    <MapPin className="w-3 h-3" />
                    {graphData?.nodes?.[nodeId]?.label || nodeId}
                  </span>
                  {i < pathResult.path.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/80 rounded-lg p-2.5 text-center">
                <div className="text-lg font-bold text-brand-blue">{pathResult.distance}</div>
                <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Units</div>
              </div>
              <div className="bg-white/80 rounded-lg p-2.5 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-brand-blue" />
                  <span className="text-lg font-bold text-brand-blue">{pathResult.estimatedTime}</span>
                </div>
                <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Est. Time</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
