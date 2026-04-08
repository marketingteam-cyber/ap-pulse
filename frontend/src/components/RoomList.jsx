import React from 'react';
import {
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  Navigation,
  ChevronRight,
} from 'lucide-react';

export default function RoomList({ rooms, onSelectRoom, onNavigate }) {
  if (!rooms || rooms.length === 0) return null;

  const available = rooms.filter(r => r.status === 'available');
  const booked = rooms.filter(r => r.status === 'booked');

  const RoomCard = ({ room }) => {
    const isAvailable = room.status === 'available';
    const nextEvent = room.schedule?.find(s => s.status === 'upcoming');

    return (
      <div
        className="group flex items-center gap-3 px-4 py-3 hover:bg-surface-50 cursor-pointer transition-colors"
        onClick={() => onSelectRoom?.(room.id)}
      >
        <div className={`p-2 rounded-xl ${isAvailable ? 'bg-green-50' : 'bg-red-50'}`}>
          {isAvailable
            ? <CheckCircle className="w-4 h-4 text-green-500" />
            : <XCircle className="w-4 h-4 text-red-500" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-slate-700 truncate">{room.name}</div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Users className="w-3 h-3" /> {room.capacity}
            </span>
            {nextEvent && (
              <span className="text-xs text-slate-400 truncate">
                Next: {nextEvent.time}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onNavigate?.(room.id); }}
            className="p-1.5 rounded-lg hover:bg-brand-blue/10 text-brand-blue transition-colors"
            title="Navigate here"
          >
            <Navigation className="w-3.5 h-3.5" />
          </button>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-surface-200">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-brand-blue" />
          <h3 className="text-sm font-bold text-slate-700">Room Availability</h3>
          <span className="ml-auto text-xs text-slate-400">
            {available.length} available / {rooms.length} total
          </span>
        </div>
      </div>

      {/* Available rooms */}
      {available.length > 0 && (
        <div>
          <div className="px-4 py-1.5 bg-green-50/50">
            <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Available Now</span>
          </div>
          <div className="divide-y divide-surface-100">
            {available.map(room => <RoomCard key={room.id} room={room} />)}
          </div>
        </div>
      )}

      {/* Booked rooms */}
      {booked.length > 0 && (
        <div>
          <div className="px-4 py-1.5 bg-red-50/50">
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Currently Booked</span>
          </div>
          <div className="divide-y divide-surface-100">
            {booked.map(room => <RoomCard key={room.id} room={room} />)}
          </div>
        </div>
      )}
    </div>
  );
}
