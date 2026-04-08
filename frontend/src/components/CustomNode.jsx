import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const typeConfig = {
  room: {
    gradient: 'from-blue-50 to-blue-100',
    border: 'border-brand-blue',
    ring: 'ring-brand-blue/20',
    iconBg: 'bg-brand-blue/10',
    textColor: 'text-brand-blue-dark',
  },
  corridor: {
    gradient: 'from-slate-50 to-slate-100',
    border: 'border-slate-300',
    ring: 'ring-slate-200',
    iconBg: 'bg-slate-100',
    textColor: 'text-slate-600',
  },
  desk: {
    gradient: 'from-amber-50 to-amber-100',
    border: 'border-amber-400',
    ring: 'ring-amber-200',
    iconBg: 'bg-amber-100',
    textColor: 'text-amber-700',
  },
};

const icons = {
  room: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  corridor: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  ),
  desk: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
};

function CustomNode({ data }) {
  const { label, nodeType, status, isOnPath, isStart, isEnd, isHeatmapActive, heatValue, onClick } = data;
  const config = typeConfig[nodeType] || typeConfig.room;

  let outerRing = '';
  let borderExtra = '';

  if (isStart) {
    outerRing = 'ring-4 ring-green-400/50';
    borderExtra = 'border-green-500';
  } else if (isEnd) {
    outerRing = 'ring-4 ring-brand-red/40';
    borderExtra = 'border-brand-red';
  } else if (isOnPath) {
    outerRing = 'ring-4 ring-brand-blue/30';
    borderExtra = 'border-brand-blue';
  }

  const statusDot = status === 'available'
    ? 'bg-green-400'
    : status === 'booked'
      ? 'bg-red-400'
      : null;

  // Heatmap overlay
  let heatOverlay = null;
  if (isHeatmapActive && heatValue !== undefined) {
    const intensity = heatValue / 100;
    const r = Math.round(220 + (intensity * 35));
    const g = Math.round(220 - (intensity * 182));
    const b = Math.round(220 - (intensity * 182));
    heatOverlay = (
      <div
        className="absolute inset-0 rounded-xl heat-pulse pointer-events-none"
        style={{
          background: `rgba(${r}, ${g}, ${b}, ${0.15 + intensity * 0.45})`,
          zIndex: -1,
          transform: `scale(${1 + intensity * 0.4})`,
        }}
      />
    );
  }

  return (
    <div
      onClick={() => onClick?.(data)}
      className={`
        relative px-3 py-2 rounded-xl border-2 shadow-sm cursor-pointer
        transition-all duration-300 hover:shadow-md hover:-translate-y-0.5
        bg-gradient-to-br ${config.gradient} ${config.border}
        ${outerRing} ${borderExtra}
        min-w-[90px] text-center
      `}
    >
      {heatOverlay}
      <Handle type="target" position={Position.Top} className="!bg-slate-300 !w-2 !h-2 !border-0" />
      <Handle type="target" position={Position.Left} className="!bg-slate-300 !w-2 !h-2 !border-0" />
      <Handle type="source" position={Position.Bottom} className="!bg-slate-300 !w-2 !h-2 !border-0" />
      <Handle type="source" position={Position.Right} className="!bg-slate-300 !w-2 !h-2 !border-0" />

      <div className="flex items-center justify-center gap-1.5">
        <span className={`${config.iconBg} p-1 rounded-md ${config.textColor}`}>
          {icons[nodeType] || icons.room}
        </span>
        <span className={`text-xs font-semibold ${config.textColor} whitespace-nowrap`}>
          {label}
        </span>
        {statusDot && (
          <span className={`w-2 h-2 rounded-full ${statusDot} flex-shrink-0`} />
        )}
      </div>

      {(isStart || isEnd) && (
        <div className={`text-[10px] font-bold mt-0.5 ${isStart ? 'text-green-600' : 'text-red-600'}`}>
          {isStart ? '● START' : '● END'}
        </div>
      )}
    </div>
  );
}

export default memo(CustomNode);
