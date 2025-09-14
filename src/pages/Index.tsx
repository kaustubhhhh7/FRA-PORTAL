import React, { useState } from 'react';
import Header from '@/components/Header';
import MapView from '@/components/MapView';
import ControlPanel from '@/components/ControlPanel';
import DetailsDrawer from '@/components/DetailsDrawer';
import { Village } from '@/data/mockData';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);
  const [filters, setFilters] = useState({
    state: 'all-states',
    district: 'all-districts',
    status: 'all-status'
  });
  const isMobile = useIsMobile();
  const { currentUser, logout } = useAuth();

  const handleVillageSelect = (village: Village) => {
    setSelectedVillage(village);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedVillage(null);
  };

  const handleCloseControlPanel = () => {
    setIsControlPanelOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col h-screen">
      <Header 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onToggleControlPanel={() => setIsControlPanelOpen(!isControlPanelOpen)}
        isControlPanelOpen={isControlPanelOpen}
      />
      
      {/* User Info and Logout */}
      <div className="bg-white border-b px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-600" />
          <span className="text-sm text-gray-600">
            Welcome, {currentUser?.displayName || currentUser?.email}
          </span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLogout}
          className="flex items-center space-x-1 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-600 px-3 py-2 rounded-lg font-medium transition-all duration-200"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
      
      <div className="flex flex-1 h-[calc(100vh-80px)] relative" style={{ minHeight: '500px', height: 'calc(100vh - 80px)' }}>
        {/* Main Content Area */}
        <div className={`flex-1 p-2 sm:p-4 ${isMobile ? 'pr-2' : 'pr-2'}`}>
          <MapView onVillageSelect={handleVillageSelect} selectedFilters={filters} />
        </div>
        
        {/* Control Panel - Desktop: Sidebar, Mobile: Overlay */}
        {isMobile ? (
          <div className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
            isControlPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`} onClick={handleCloseControlPanel}>
            <div className={`fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-dashboard-sidebar transform transition-transform duration-300 ease-in-out ${
              isControlPanelOpen ? 'translate-x-0' : 'translate-x-full'
            }`} onClick={(e) => e.stopPropagation()}>
              <ControlPanel 
                selectedFilters={filters}
                onFilterChange={setFilters}
                onClose={handleCloseControlPanel}
                isMobile={true}
              />
            </div>
          </div>
        ) : (
          <div className="w-80 p-4 pl-2">
            <ControlPanel 
              selectedFilters={filters}
              onFilterChange={setFilters}
              isMobile={false}
            />
          </div>
        )}
        
        {/* Details Drawer - Slides from right */}
        <DetailsDrawer
          village={selectedVillage}
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};

export default Index;
