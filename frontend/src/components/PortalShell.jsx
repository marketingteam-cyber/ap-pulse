import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FloorMap from './FloorMap';
import SearchBar from './SearchBar';
import {
  Compass,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
  User,
  Navigation,
} from 'lucide-react';
import { fetchGraph, fetchRooms, fetchShortestPath, fetchHeatmap } from '../utils/api';

export default function PortalShell({ tabs, activeTab, setActiveTab, renderSidebar, portalLabel, portalAccent }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [graphData, setGraphData] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [heatmapData, setHeatmapData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Navigation state
  const [startNode, setStartNode] = useState('');
  const [endNode, setEndNode] = useState('');
  const [pathResult, setPathResult] = useState(null);
  const [navMode, setNavMode] = useState(false);
  const [navModeStep, setNavModeStep] = useState('start');

  // UI state
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Load data
  useEffect(() => {
    Promise.all([fetchGraph(), fetchRooms(), fetchHeatmap()])
      .then(([graph, roomsData, heatmap]) => {
        setGraphData(graph);
        setRooms(roomsData);
        setHeatmapData(heatmap);
        setLoading(false);
      });
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleNavigate = useCallback(async (start, end) => {
    try {
      const result = await fetchShortestPath(start, end);
      if (result.error) { showToast(result.error, 'error'); return; }
      setPathResult(result);
      showToast(`Route found: ${result.estimatedTime}`, 'success');
    } catch {
      showToast('Failed to calculate route', 'error');
    }
  }, [showToast]);

  const handleClearPath = useCallback(() => {
    setPathResult(null);
    setStartNode('');
    setEndNode('');
    setNavMode(false);
    setNavModeStep('start');
  }, []);

  const handleNodeClick = useCallback((nodeId) => {
    const room = rooms.find(r => r.id === nodeId);
    if (room) setSelectedRoom(room);
  }, [rooms]);

  const handleMapNodeSelect = useCallback((nodeId) => {
    if (navModeStep === 'start') {
      setStartNode(nodeId);
      setNavModeStep('end');
      showToast(`Start: ${graphData?.nodes?.[nodeId]?.label}. Now click destination.`, 'info');
    } else {
      setEndNode(nodeId);
      setNavModeStep('start');
      setNavMode(false);
      if (startNode && nodeId) handleNavigate(startNode, nodeId);
    }
  }, [navModeStep, startNode, graphData, handleNavigate, showToast]);

  const handleNavigateTo = useCallback((nodeId) => {
    setEndNode(nodeId);
    // Switch to navigate tab if available
    const navTab = tabs.find(t => t.id === 'navigate');
    if (navTab) setActiveTab('navigate');
    if (startNode) handleNavigate(startNode, nodeId);
    else showToast('Select a start location', 'info');
  }, [startNode, tabs, setActiveTab, handleNavigate, showToast]);

  const handleSelectRoom = useCallback((roomId) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) setSelectedRoom(room);
  }, [rooms]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <Compass className="w-10 h-10 text-brand-blue animate-spin mx-auto" style={{ animationDuration: '3s' }} />
          <h2 className="text-lg font-bold text-slate-700 mt-4">Loading AP Pulse</h2>
          <p className="text-sm text-slate-400 mt-1">Initializing floor map...</p>
        </div>
      </div>
    );
  }

  // Pass state to sidebar renderer
  const sidebarProps = {
    graphData, rooms, heatmapData,
    startNode, endNode, setStartNode, setEndNode,
    pathResult, navMode, setNavMode: (v) => { setNavMode(v); setNavModeStep('start'); },
    handleNavigate, handleClearPath,
    selectedRoom, setSelectedRoom, handleSelectRoom,
    showHeatmap, setShowHeatmap,
    handleNavigateTo,
  };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-surface-200 px-4 lg:px-6 py-3 flex items-center gap-4 sticky top-0 z-40 shadow-sm">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-surface-100 text-slate-600"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <svg viewBox="0 0 32 32" className="w-8 h-8">
            <path d="M16 3 L5 28 L11 28 L16 16 L21 28 L27 28 Z" fill="#1A4FAD" />
            <path d="M5 28 L11 28 L16 16 L13 16 Z" fill="#DC2626" />
          </svg>
          <div>
            <h1 className="text-base font-extrabold text-slate-800 tracking-tight leading-none">
              AP <span className="text-brand-blue">Pulse</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">{portalLabel}</p>
          </div>
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <SearchBar onSelectRoom={handleSelectRoom} onNavigateTo={handleNavigateTo} graphData={graphData} />
        </div>

        {/* Nav mode indicator */}
        {navMode && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-blue/10 text-brand-blue text-xs font-medium animate-pulse">
            <Compass className="w-3.5 h-3.5" />
            Click a node: selecting {navModeStep === 'start' ? 'START' : 'DESTINATION'}
          </div>
        )}

        {/* Tabs – desktop */}
        <nav className="hidden lg:flex items-center gap-1 ml-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive ? `${portalAccent} text-white shadow-sm` : 'text-slate-500 hover:text-slate-700 hover:bg-surface-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* User menu */}
        <div className="flex items-center gap-2 ml-2 pl-3 border-l border-surface-200">
          <div className="hidden sm:block text-right">
            <div className="text-xs font-semibold text-slate-700 leading-none">{user?.name}</div>
            <div className="text-[10px] text-slate-400 capitalize mt-0.5">{user?.role}</div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-surface-200 px-4 py-3 animate-fade-in">
          <div className="mb-3">
            <SearchBar onSelectRoom={handleSelectRoom} onNavigateTo={handleNavigateTo} graphData={graphData} />
          </div>
          <nav className="flex gap-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                  className={`flex-1 flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive ? `${portalAccent} text-white` : 'text-slate-500 hover:bg-surface-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className={`${
          sidebarCollapsed ? 'w-0 lg:w-0' : 'w-full lg:w-[380px]'
        } flex-shrink-0 overflow-y-auto bg-surface-50 transition-all duration-300 ${
          mobileMenuOpen ? 'hidden' : ''
        } ${!sidebarCollapsed ? 'border-r border-surface-200' : ''}
        ${!sidebarCollapsed ? 'absolute lg:relative z-30 lg:z-auto inset-0 top-[57px] lg:top-auto bg-surface-50' : 'hidden lg:block'}
        `}>
          <div className={`${sidebarCollapsed ? 'hidden' : 'block'} p-4 space-y-4`}>
            {renderSidebar(sidebarProps)}
          </div>
        </aside>

        {/* Sidebar toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex items-center justify-center w-5 bg-surface-100 hover:bg-surface-200 border-r border-surface-200 text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
        >
          {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        {/* Map */}
        <main className="flex-1 relative p-3 lg:p-4 min-h-0">
          <FloorMap
            graphData={graphData}
            rooms={rooms}
            pathResult={pathResult}
            startNode={startNode}
            endNode={endNode}
            heatmapData={heatmapData}
            showHeatmap={showHeatmap}
            onNodeClick={handleNodeClick}
            navMode={navMode}
            onMapNodeSelect={handleMapNodeSelect}
          />

          {/* Legend */}
          <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl border border-surface-200 shadow-sm px-4 py-3 hidden md:block">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Legend</div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded border-2 border-brand-blue bg-blue-50" />
                <span className="text-[11px] text-slate-600">Room</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded border-2 border-slate-300 bg-slate-50" />
                <span className="text-[11px] text-slate-600">Corridor</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded border-2 border-amber-400 bg-amber-50" />
                <span className="text-[11px] text-slate-600">Desk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-[11px] text-slate-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-[11px] text-slate-600">Booked</span>
              </div>
            </div>
          </div>

          {/* Mobile sidebar trigger */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="lg:hidden absolute top-6 left-6 bg-white shadow-md border border-surface-200 rounded-xl p-2.5 text-slate-600"
          >
            <Menu className="w-5 h-5" />
          </button>
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 toast-enter flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border ${
          toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-700'
            : toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-blue-50 border-blue-200 text-brand-blue'
        }`}>
          {toast.type === 'success' && <Navigation className="w-4 h-4" />}
          {toast.type === 'error' && <X className="w-4 h-4" />}
          {toast.type === 'info' && <Compass className="w-4 h-4" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
