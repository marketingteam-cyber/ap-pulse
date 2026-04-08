import React from 'react';
import {
  X,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Navigation,
  Monitor,
  Wifi,
  Coffee,
} from 'lucide-react';

const amenityIcons = {
  'Projector': Monitor,
  'TV Display': Monitor,
  'Display': Monitor,
  'Video Conferencing': Monitor,
  'Wi-Fi': Wifi,
  'Coffee Machine': Coffee,
  default: CheckCircle,
};

export default function RoomDetails({ room, graphData, onClose, onNavigate }) {
  if (!room) return null;

  const isAvailable = room.status === 'available';

  return (
    <div className="animate-slide-up bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className={`px-5 py-4 ${isAvailable ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-brand-red to-red-600'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-white">
            <MapPin className="w-5 h-5" />
            <div>
              <h3 className="font-bold text-base">{room.name}</h3>
              <p className="text-white/80 text-xs mt-0.5">Floor {room.floor}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Status + Capacity */}
        <div className="flex gap-2">
          <div className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl ${isAvailable ? 'bg-green-50' : 'bg-red-50'}`}>
            {isAvailable
              ? <CheckCircle className="w-4 h-4 text-green-500" />
              : <XCircle className="w-4 h-4 text-red-500" />
            }
            <span className={`text-sm font-semibold ${isAvailable ? 'text-green-700' : 'text-red-700'}`}>
              {isAvailable ? 'Available' : 'Occupied'}
            </span>
          </div>
          <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-surface-50">
            <Users className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-semibold text-slate-700">{room.capacity} seats</span>
          </div>
        </div>

        {/* Amenities */}
        {room.amenities && room.amenities.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Amenities</h4>
            <div className="flex flex-wrap gap-1.5">
              {room.amenities.map(amenity => {
                const Icon = amenityIcons[amenity] || amenityIcons.default;
                return (
                  <span
                    key={amenity}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-surface-50 text-slate-600"
                  >
                    <Icon className="w-3 h-3" />
                    {amenity}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Schedule */}
        {room.schedule && room.schedule.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Today's Schedule</h4>
            <div className="space-y-1.5">
              {room.schedule.map((event, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 px-3 py-2.5 rounded-lg border ${
                    event.status === 'in_progress'
                      ? 'bg-blue-50 border-blue-200'
                      : event.status === 'completed'
                        ? 'bg-surface-50 border-surface-200 opacity-60'
                        : 'bg-white border-surface-200'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 mt-0.5 text-slate-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-700 truncate">{event.title}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-slate-500">{event.time}</span>
                      <span className="text-[10px] text-slate-400">• {event.booked_by}</span>
                    </div>
                  </div>
                  {event.status === 'in_progress' && (
                    <span className="text-[10px] font-bold text-brand-blue bg-brand-blue/10 px-1.5 py-0.5 rounded">LIVE</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigate button */}
        <button
          onClick={() => onNavigate?.(room.id)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-blue text-white font-semibold text-sm hover:bg-brand-blue-dark transition-all shadow-sm hover:shadow-md"
        >
          <Navigation className="w-4 h-4" />
          Navigate Here
        </button>
      </div>
    </div>
  );
}
