import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, BarChart3, Grid3X3, Menu, X, LogIn, LogOut, User, Bell, ChevronDown, Mail, Shield, Calendar } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const { currentUser, logout, userRole } = useAuth();
  const navigate = useNavigate();
  const desktopProfileDropdownRef = useRef<HTMLDivElement>(null);
  const mobileProfileDropdownRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: 'dashboard', label: 'Home', icon: Grid3X3 },
    { id: 'map', label: 'Map', icon: MapPin },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleLogout = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log('=== HEADER LOGOUT STARTED ===');
    
    try {
      // Set loading state
      setIsLoggingOut(true);
      console.log('Loading state set to true');
      
      // Close dropdowns immediately
      setIsProfileDropdownOpen(false);
      setIsMobileMenuOpen(false);
      console.log('Dropdowns closed');
      
      // Call the logout function from AuthContext
      console.log('Calling logout from AuthContext');
      await logout();
      console.log('AuthContext logout completed');
      
      // Force immediate navigation using window.location for reliability
      console.log('Forcing navigation to home page');
      window.location.href = '/';
      
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, force navigation
      window.location.href = '/';
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const targetNode = event.target as Node;
      const clickedInsideDesktop = desktopProfileDropdownRef.current
        ? desktopProfileDropdownRef.current.contains(targetNode)
        : false;
      const clickedInsideMobile = mobileProfileDropdownRef.current
        ? mobileProfileDropdownRef.current.contains(targetNode)
        : false;

      if (!clickedInsideDesktop && !clickedInsideMobile) setIsProfileDropdownOpen(false);
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

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
          <div className="hidden md:flex items-center space-x-1">
            <nav className="flex items-center space-x-1">
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
            
            {/* Authentication Button - Positioned at the far right */}
            <div className="ml-6 pl-4 border-l border-white/20">
              {currentUser ? (
                <div className="relative" ref={desktopProfileDropdownRef}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleProfileDropdown}
                    className="border-white/40 text-white hover:bg-white/20 bg-white/10 flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </Button>
                  
                  {/* Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-200">
                      <div className="p-4">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
                            </h3>
                            <p className="text-sm text-gray-600">{currentUser.email}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center space-x-3 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>{currentUser.email}</span>
                          </div>
                          
                          {userRole === 'government' && (
                            <div className="flex items-center space-x-3 text-sm text-gray-600">
                              <Shield className="w-4 h-4 text-green-600" />
                              <span className="text-green-600 font-medium">Government Administrator</span>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-3 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Member since {new Date().getFullYear()}</span>
                          </div>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoggingOut ? (
                              <>
                                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                                Logging out...
                              </>
                            ) : (
                              <>
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignIn}
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent transition-all duration-200 hover:shadow-lg hover:scale-105"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Mobile Sign In Button - Right side */}
            {!currentUser && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignIn}
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent transition-all duration-200 hover:shadow-lg hover:scale-105 touch-target"
              >
                <LogIn className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            )}
            
            {/* Mobile User Info and Logout - Right side */}
            {currentUser && (
              <div className="relative" ref={mobileProfileDropdownRef}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleProfileDropdown}
                  className="border-white/40 text-white hover:bg-white/20 bg-white/10 touch-target flex items-center space-x-1"
                >
                  <User className="w-4 h-4" />
                  <span className="text-xs font-medium hidden sm:inline">
                    {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
                  </span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </Button>
                
                {/* Mobile Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
                          </h3>
                          <p className="text-xs text-gray-600">{currentUser.email}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{currentUser.email}</span>
                        </div>
                        
                        {userRole === 'government' && (
                          <div className="flex items-center space-x-2 text-xs text-gray-600">
                            <Shield className="w-3 h-3 text-green-600" />
                            <span className="text-green-600 font-medium">Government Administrator</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="border-t border-gray-200 pt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoggingOut ? (
                            <>
                              <div className="w-3 h-3 mr-1 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                              Logging out...
                            </>
                          ) : (
                            <>
                              <LogOut className="w-3 h-3 mr-1" />
                              Logout
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
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
              
              {/* Mobile Authentication Button */}
              <div className="pt-2 border-t border-white/20">
                {currentUser ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 bg-white/10 rounded-lg">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">
                            {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
                          </h4>
                          <p className="text-xs text-white/80">{currentUser.email}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-xs text-white/80">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-3 h-3" />
                          <span>{currentUser.email}</span>
                        </div>
                        
                        {userRole === 'government' && (
                          <div className="flex items-center space-x-2">
                            <Shield className="w-3 h-3 text-green-400" />
                            <span className="text-green-400 font-medium">Government Administrator</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Mobile menu logout button clicked directly');
                        handleLogout();
                      }}
                      disabled={isLoggingOut}
                      className="w-full justify-start border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoggingOut ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                          Logging out...
                        </>
                      ) : (
                        <>
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleSignIn}
                    className="w-full justify-start border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent transition-all duration-200 hover:shadow-lg"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;