import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, FileText, BarChart3, Grid3X3, Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onToggleControlPanel?: () => void;
  isControlPanelOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  onTabChange, 
  onToggleControlPanel,
  isControlPanelOpen = false 
}) => {
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Grid3X3 },
    { id: 'map', label: 'Map', icon: MapPin },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="bg-dashboard-nav text-dashboard-nav-foreground shadow-lg border-b">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center border-2 border-white">
                <MapPin className="w-4 h-4 sm:w-6 sm:h-6 text-black" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold">FRA Portal</h1>
                <p className="text-xs sm:text-sm opacity-90 hidden sm:block">Forest Rights Administration</p>
              </div>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "secondary" : "outline"}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center space-x-2 font-medium ${
                    activeTab === tab.id 
                      ? 'bg-white text-dashboard-nav shadow-md border-white' 
                      : 'border-white/30 text-white hover:bg-white/20 bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${
                    activeTab === tab.id ? 'text-dashboard-nav' : 'text-white'
                  }`} />
                  <span className={`${
                    activeTab === tab.id ? 'mobile-nav-active' : 'mobile-nav-text'
                  }`}>{tab.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* Mobile Controls */}
          <div className="flex items-center space-x-2 md:hidden">
            {onToggleControlPanel && (
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleControlPanel}
                className="border-white/40 text-white hover:bg-white/20 bg-white/10 touch-target"
              >
                {isControlPanelOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="border-white/40 text-white hover:bg-white/20 bg-white/10 touch-target"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobile && isMobileMenuOpen && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <nav className="flex flex-col space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "secondary" : "outline"}
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full justify-start font-medium ${
                      activeTab === tab.id 
                        ? 'bg-white text-dashboard-nav shadow-md border-white' 
                        : 'border-white/30 text-white hover:bg-white/20 bg-white/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mr-2 ${
                      activeTab === tab.id ? 'text-dashboard-nav' : 'text-white'
                    }`} />
                    <span className={`${
                      activeTab === tab.id ? 'mobile-nav-active' : 'mobile-nav-text'
                    }`}>{tab.label}</span>
                  </Button>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;