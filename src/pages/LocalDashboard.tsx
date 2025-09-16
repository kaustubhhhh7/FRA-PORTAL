import React, { useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MapPin, 
  FileText, 
  BarChart3, 
  LogOut, 
  User, 
  Users,
  Grid3X3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Eye,
  Bell,
  Menu,
  X,
  TreePine  
} from 'lucide-react';
import MapView from '@/components/MapView';
import ControlPanel from '@/components/ControlPanel';
import DetailsDrawer from '@/components/DetailsDrawer';
import AlertViewer from '@/components/AlertViewer';
import ForestLayout from '@/components/ForestLayout';
import { Village, Alert as AlertType, ForestArea, mockAlerts } from '@/data/mockData';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

const LocalDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);
  const [selectedForest, setSelectedForest] = useState<ForestArea | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [alerts] = useState<AlertType[]>(mockAlerts);
  const [complaintForm, setComplaintForm] = useState({
    village: '',
    issue: '',
    description: '',
    priority: 'medium'
  });
  const [myComplaints, setMyComplaints] = useState([
    {
      id: 1,
      village: 'Kendupali',
      issue: 'Claim status shows as pending but should be approved',
      status: 'open',
      date: '2024-01-15',
      priority: 'high',
      response: ''
    },
    {
      id: 2,
      village: 'Village ABC',
      issue: 'Incorrect land area calculation',
      status: 'in-progress',
      date: '2024-01-14',
      priority: 'medium',
      response: 'We are reviewing your complaint and will update you soon.'
    }
  ]);
  const [filters, setFilters] = useState({
    state: 'all-states',
    district: 'all-districts',
    status: 'all-status'
  });
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const longPressTimer = useRef<number | null>(null);
  const { currentUser, logout } = useAuth();
  // Added: limitedMode for anonymous users
  const limitedMode = !currentUser;

  const handleVillageSelect = (village: Village) => {
    setSelectedVillage(village);
    setIsDrawerOpen(true);
  };

  const handleForestSelect = (forest: ForestArea) => {
    setSelectedForest(forest);
    console.log('Selected forest:', forest);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedVillage(null);
  };

  const handleCloseControlPanel = () => {
    setIsControlPanelOpen(false);
  };

  const handleLogout = async () => {
    console.log('LocalDashboard: Logout button clicked');
    try {
      console.log('LocalDashboard: Starting logout process...');
      await logout();
      console.log('LocalDashboard: Logout completed');
      setTimeout(() => {
        console.log('LocalDashboard: Forcing redirect to landing page');
        window.location.href = '/';
      }, 200);
    } catch (error) {
      console.error('LocalDashboard: Failed to log out:', error);
      window.location.href = '/';
    }
  };

  const handleSubmitComplaint = () => {
    if (complaintForm.village && complaintForm.issue && complaintForm.description) {
      const newComplaint = {
        id: Date.now(),
        village: complaintForm.village,
        issue: complaintForm.issue,
        status: 'open',
        date: new Date().toISOString().split('T')[0],
        priority: complaintForm.priority,
        response: ''
      };
      setMyComplaints([newComplaint, ...myComplaints]);
      setComplaintForm({ village: '', issue: '', description: '', priority: 'medium' });
      setShowComplaintForm(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'open': return 'bg-red-100 text-red-800 border-red-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col h-screen">
      {/* Header */}
      <header className="bg-dashboard-nav text-dashboard-nav-foreground shadow-lg border-b">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div
                className="flex items-center space-x-2 select-none"
                onPointerDown={() => {
                  // Long-press (700ms) on the logo triggers secret access prompt (mobile-friendly)
                  longPressTimer.current = window.setTimeout(() => {
                    const pass = window.prompt('Enter government access passcode');
                    if (pass && pass === import.meta.env.VITE_GOV_PASSCODE) {
                      navigate('/login?role=government');
                    }
                  }, 700);
                }}
                onPointerUp={() => {
                  if (longPressTimer.current) {
                    window.clearTimeout(longPressTimer.current);
                    longPressTimer.current = null;
                  }
                }}
                onPointerLeave={() => {
                  if (longPressTimer.current) {
                    window.clearTimeout(longPressTimer.current);
                    longPressTimer.current = null;
                  }
                }}
              >
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
              {[
                // Show extra tabs only for authenticated users
                ...(!limitedMode ? [{ id: 'dashboard', label: 'Dashboard', icon: Grid3X3 }] : []),
                { id: 'map', label: 'Map', icon: MapPin },
                { id: 'forests', label: 'Forests', icon: TreePine },
                { id: 'alerts', label: 'Alerts', icon: Bell },
                ...(!limitedMode ? [{ id: 'complaints', label: 'My Complaints', icon: AlertTriangle }] : []),
                { id: 'analytics', label: 'Analytics', icon: BarChart3 }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "secondary" : "outline"}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 font-semibold px-4 py-2 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id 
                        ? 'bg-white text-black shadow-lg border-2 border-white hover:bg-gray-100' 
                        : 'border-2 border-white/40 text-white hover:bg-white/20 hover:border-white/60 bg-white/10 hover:shadow-md'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${
                      activeTab === tab.id ? 'text-dashboard-nav' : 'text-white'
                    }`} />
                    <span>{tab.label}</span>
                  </Button>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="border-2 border-white/40 text-white hover:bg-white/20 hover:border-white/60 bg-white/10 px-3 py-2 rounded-lg transition-all duration-200"
              >
                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>

            {/* Desktop User Info and Logout */}
            <div className="hidden md:flex items-center space-x-2">
              <Badge className="bg-white text-black">
                <Users className="w-3 h-3 mr-1" />
                User
              </Badge>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-white" />
                <span className="text-sm text-white">
                  {limitedMode ? 'Limited data - please sign in' : (currentUser?.displayName || currentUser?.email)}
                </span>
              </div>
              {!limitedMode && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center space-x-1 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-600 px-3 py-2 rounded-lg font-medium transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-white/20 bg-gray-900">
              <div className="pt-4 space-y-2">
                {/* Mobile Navigation Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                  {[
                    ...(!limitedMode ? [{ id: 'dashboard', label: 'Dashboard', icon: Grid3X3 }] : []),
                    { id: 'map', label: 'Map', icon: MapPin },
                    { id: 'forests', label: 'Forests', icon: TreePine },
                    { id: 'alerts', label: 'Alerts', icon: Bell },
                    ...(!limitedMode ? [{ id: 'complaints', label: 'Complaints', icon: AlertTriangle }] : []),
                    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? "default" : "outline"}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`flex items-center space-x-1 sm:space-x-2 font-semibold px-2 sm:px-3 py-2 rounded-lg transition-all duration-200 ${
                          activeTab === tab.id 
                            ? 'bg-white text-black shadow-lg border-2 border-white hover:bg-gray-100' 
                            : 'border-2 border-white/40 text-white bg-white/10 hover:bg-white/20 hover:border-white/60'
                        }`}
                      >
                        <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm">{tab.label}</span>
                      </Button>
                    );
                  })}
                </div>

                {/* Mobile User Info and Logout */}
                <div className="flex flex-col space-y-2 pt-2 border-t border-white/20">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-white text-black border border-white">
                      <Users className="w-3 h-3 mr-1" />
                      User
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-white" />
                    <span className="text-sm text-white font-medium">
                      {limitedMode ? 'Limited data - please sign in' : (currentUser?.displayName || currentUser?.email)}
                    </span>
                  </div>
                  {!limitedMode && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleLogout}
                      className="flex items-center space-x-1 border-2 border-red-500 text-red-500 bg-white hover:bg-red-500 hover:text-white hover:border-red-600 px-3 py-2 rounded-lg font-medium transition-all duration-200"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 h-[calc(100vh-80px)] relative">
        {/* Mobile Control Panel Toggle */}
        {isMobile && (
          <div className="fixed right-4 bottom-24 z-50">
            <Button
              onClick={() => setIsControlPanelOpen(!isControlPanelOpen)}
              className="bg-white text-black shadow-lg border-2 border-white hover:bg-gray-100 transition-all duration-200 rounded-full px-4 py-2"
            >
              <Menu className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        )}

        {/* Mobile Control Panel Overlay */}
        {isMobile && isControlPanelOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsControlPanelOpen(false)}>
            <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50" onClick={(e) => e.stopPropagation()}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Filters & Options</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsControlPanelOpen(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <ControlPanel 
                  selectedFilters={filters}
                  onFilterChange={setFilters}
                  isMobile={true}
                />
              </div>
            </div>
          </div>
        )}

        {/* Map View */}
        {activeTab === 'map' && (
          <div className="flex-1 p-2 sm:p-4">
            {/* Pass limitedMode for anonymous users */}
            <MapView onVillageSelect={handleVillageSelect} selectedFilters={filters} userType="local" limitedMode={limitedMode} />
          </div>
        )}

        {/* Forest Layout View */}
        {activeTab === 'forests' && (
          <div className="flex-1 h-full">
            <ForestLayout onForestSelect={handleForestSelect} userType="local" />
          </div>
        )}

        {/* Alerts View */}
        {activeTab === 'alerts' && (
          <div className="flex-1 p-4">
            <AlertViewer alerts={alerts} />
          </div>
        )}

        {/* Complaints View */}
        {activeTab === 'complaints' && (
          <div className="flex-1 p-4">
            <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">My Complaints</h2>
                <p className="text-muted-foreground">Track your submitted complaints and issues</p>
              </div>
              <Button 
                onClick={() => setShowComplaintForm(true)}
                className="btn-primary w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Submit New Complaint
              </Button>
            </div>
            
            {/* Complaint Form Modal */}
            {showComplaintForm && (
              <Card className="mb-6 border-2">
                <CardHeader>
                  <CardTitle>Submit New Complaint</CardTitle>
                  <CardDescription>
                    Report an issue or discrepancy with forest rights claims
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Village Name</label>
                    <input
                      type="text"
                      value={complaintForm.village}
                      onChange={(e) => setComplaintForm({...complaintForm, village: e.target.value})}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      placeholder="Enter village name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Issue Type</label>
                    <input
                      type="text"
                      value={complaintForm.issue}
                      onChange={(e) => setComplaintForm({...complaintForm, issue: e.target.value})}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      placeholder="Brief description of the issue"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Detailed Description</label>
                    <textarea
                      value={complaintForm.description}
                      onChange={(e) => setComplaintForm({...complaintForm, description: e.target.value})}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md h-24"
                      placeholder="Provide detailed information about the issue"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Priority</label>
                    <select
                      value={complaintForm.priority}
                      onChange={(e) => setComplaintForm({...complaintForm, priority: e.target.value})}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleSubmitComplaint} className="btn-primary">
                      Submit Complaint
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowComplaintForm(false)}
                      className="btn-outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="space-y-4">
              {myComplaints.map((complaint) => (
                <Card key={complaint.id} className="border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{complaint.village}</CardTitle>
                        <CardDescription>
                          Submitted on {complaint.date}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(complaint.status)}>
                          {complaint.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                        <span className={`text-sm font-medium ${getPriorityColor(complaint.priority)}`}>
                          {complaint.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-foreground">Issue:</h4>
                        <p className="text-muted-foreground">{complaint.issue}</p>
                      </div>
                      {complaint.response && (
                        <div>
                          <h4 className="font-medium text-foreground">Government Response:</h4>
                          <p className="text-muted-foreground bg-gray-50 p-3 rounded-md">
                            {complaint.response}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Analytics View */}
        {activeTab === 'analytics' && (
          <div className="flex-1 p-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Analytics Dashboard</h2>
              <p className="text-muted-foreground">{limitedMode ? 'Sign in to view detailed analytics' : 'View forest rights statistics and trends'}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Claims</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{limitedMode ? '—' : '1,234'}</div>
                  <p className="text-sm text-muted-foreground">In your region</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Approved Claims</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{limitedMode ? '—' : '856'}</div>
                  <p className="text-sm text-muted-foreground">{limitedMode ? 'Login required' : '69% approval rate'}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">My Complaints</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600">{limitedMode ? '—' : myComplaints.length}</div>
                  <p className="text-sm text-muted-foreground">{limitedMode ? 'Sign in to view' : 'Submitted complaints'}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Desktop Control Panel */}
        {!isMobile && (
          <div className="w-80 p-4 pl-2">
            <ControlPanel 
              selectedFilters={filters}
              onFilterChange={setFilters}
              isMobile={false}
            />
          </div>
        )}
      </div>

      {/* Details Drawer (Read-only for local users) */}
      <DetailsDrawer
        village={selectedVillage}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        isMobile={isMobile}
        isGovernmentUser={false}
        // Pass limitedMode to hide sensitive fields when anonymous
        limitedMode={limitedMode}
      />
    </div>
  );
};

export default LocalDashboard;
