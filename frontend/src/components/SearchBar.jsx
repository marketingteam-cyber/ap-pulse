import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, User, X, ArrowRight } from 'lucide-react';
import { searchAll } from '../utils/api';

export default function SearchBar({ onSelectRoom, onNavigateTo, graphData }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ rooms: [], people: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ rooms: [], people: [] });
      setIsOpen(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      const data = await searchAll(query);
      setResults(data);
      setIsOpen(true);
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    if (item.type === 'room') {
      onSelectRoom?.(item.id);
    } else if (item.type === 'person') {
      onSelectRoom?.(item.location);
    }
    setQuery('');
    setIsOpen(false);
  };

  const handleNavigate = (locationId, e) => {
    e.stopPropagation();
    onNavigateTo?.(locationId);
    setQuery('');
    setIsOpen(false);
  };

  const hasResults = results.rooms.length > 0 || results.people.length > 0;

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search rooms, people..."
          className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-surface-200 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all shadow-sm"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setIsOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 top-full mt-2 w-full bg-white border border-surface-200 rounded-xl shadow-lg overflow-hidden animate-fade-in">
          {!hasResults && !loading && (
            <div className="px-4 py-6 text-center text-sm text-slate-400">
              No results for "{query}"
            </div>
          )}

          {loading && (
            <div className="px-4 py-4 text-center text-sm text-slate-400">
              Searching...
            </div>
          )}

          {results.rooms.length > 0 && (
            <div>
              <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-surface-50">
                Rooms
              </div>
              {results.rooms.map(room => (
                <button
                  key={room.id}
                  onClick={() => handleSelect(room)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-50 transition-colors text-left"
                >
                  <div className="bg-brand-blue/10 p-1.5 rounded-lg">
                    <MapPin className="w-3.5 h-3.5 text-brand-blue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-700 truncate">{room.name}</div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${room.status === 'available' ? 'bg-green-400' : 'bg-red-400'}`} />
                      <span className="text-xs text-slate-400 capitalize">{room.status}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleNavigate(room.id, e)}
                    className="p-1.5 rounded-lg hover:bg-brand-blue/10 text-brand-blue transition-colors"
                    title="Navigate here"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </button>
              ))}
            </div>
          )}

          {results.people.length > 0 && (
            <div>
              <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-surface-50">
                People
              </div>
              {results.people.map(person => (
                <button
                  key={person.id}
                  onClick={() => handleSelect(person)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-50 transition-colors text-left"
                >
                  <div className="bg-amber-100 p-1.5 rounded-lg">
                    <User className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-700 truncate">{person.name}</div>
                    <div className="text-xs text-slate-400">{person.role}</div>
                  </div>
                  <button
                    onClick={(e) => handleNavigate(person.location, e)}
                    className="p-1.5 rounded-lg hover:bg-brand-blue/10 text-brand-blue transition-colors"
                    title="Navigate to this person"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
