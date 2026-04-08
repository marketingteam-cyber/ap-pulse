import React, { useState } from 'react';
import PortalShell from '../components/PortalShell';
import NavigationPanel from '../components/NavigationPanel';
import RoomDetails from '../components/RoomDetails';
import RoomList from '../components/RoomList';
import AdminDashboard from '../components/AdminDashboard';
import AdZones from '../components/AdZones';
import { BarChart3, Megaphone, MapPin, Navigation } from 'lucide-react';

const TABS = [
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'ads', label: 'Ad Zones', icon: Megaphone },
  { id: 'rooms', label: 'Rooms', icon: MapPin },
  { id: 'navigate', label: 'Navigate', icon: Navigation },
];

export default function EmployerPortal() {
  const [activeTab, setActiveTab] = useState('analytics');

  const renderSidebar = (props) => {
    const {
      graphData, rooms,
      startNode, endNode, setStartNode, setEndNode,
      pathResult, navMode, setNavMode,
      handleNavigate, handleClearPath,
      selectedRoom, setSelectedRoom, handleSelectRoom,
      showHeatmap, setShowHeatmap,
      handleNavigateTo,
    } = props;

    return (
      <>
        {activeTab === 'analytics' && (
          <AdminDashboard
            showHeatmap={showHeatmap}
            setShowHeatmap={setShowHeatmap}
            graphData={graphData}
          />
        )}

        {activeTab === 'ads' && (
          <AdZones graphData={graphData} />
        )}

        {activeTab === 'rooms' && (
          <>
            {selectedRoom && (
              <RoomDetails
                room={selectedRoom}
                graphData={graphData}
                onClose={() => setSelectedRoom(null)}
                onNavigate={handleNavigateTo}
              />
            )}
            <RoomList
              rooms={rooms}
              onSelectRoom={handleSelectRoom}
              onNavigate={handleNavigateTo}
            />
          </>
        )}

        {activeTab === 'navigate' && (
          <>
            <NavigationPanel
              graphData={graphData}
              onNavigate={handleNavigate}
              pathResult={pathResult}
              onClear={handleClearPath}
              startNode={startNode}
              endNode={endNode}
              setStartNode={setStartNode}
              setEndNode={setEndNode}
              navMode={navMode}
              setNavMode={setNavMode}
            />
            {selectedRoom && (
              <RoomDetails
                room={selectedRoom}
                graphData={graphData}
                onClose={() => setSelectedRoom(null)}
                onNavigate={handleNavigateTo}
              />
            )}
          </>
        )}
      </>
    );
  };

  return (
    <PortalShell
      tabs={TABS}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      renderSidebar={renderSidebar}
      portalLabel="EMPLOYER PORTAL"
      portalAccent="bg-slate-800"
    />
  );
}
