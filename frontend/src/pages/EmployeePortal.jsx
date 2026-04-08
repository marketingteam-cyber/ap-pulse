import React, { useState } from 'react';
import PortalShell from '../components/PortalShell';
import NavigationPanel from '../components/NavigationPanel';
import RoomDetails from '../components/RoomDetails';
import RoomList from '../components/RoomList';
import { Navigation, MapPin } from 'lucide-react';

const TABS = [
  { id: 'navigate', label: 'Navigate', icon: Navigation },
  { id: 'rooms', label: 'Rooms', icon: MapPin },
];

export default function EmployeePortal() {
  const [activeTab, setActiveTab] = useState('navigate');

  const renderSidebar = (props) => {
    const {
      graphData, rooms,
      startNode, endNode, setStartNode, setEndNode,
      pathResult, navMode, setNavMode,
      handleNavigate, handleClearPath,
      selectedRoom, setSelectedRoom, handleSelectRoom,
      handleNavigateTo,
    } = props;

    return (
      <>
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
      </>
    );
  };

  return (
    <PortalShell
      tabs={TABS}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      renderSidebar={renderSidebar}
      portalLabel="EMPLOYEE PORTAL"
      portalAccent="bg-brand-blue"
    />
  );
}
