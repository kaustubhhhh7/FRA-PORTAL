import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MapPin, 
  FileText, 
  BarChart3, 
  Grid3X3, 
  LogOut, 
  User, 
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  Edit,
  Save,
  Trash2,
  Bell,
  Menu
} from 'lucide-react';
import MapView from '@/components/MapView';
import ControlPanel from '@/components/ControlPanel';
import DetailsDrawer from '@/components/DetailsDrawer';
import AlertManagement from '@/components/AlertManagement';
import { Village, Alert as AlertType, mockAlerts } from '@/data/mockData';
import { useIsMobile } from '@/hooks/use-mobile';

const GovernmentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedVillage, setEditedVillage] = useState<Village | null>(null);
  const [alerts, setAlerts] = useState<AlertType[]>(mockAlerts);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      village: 'Kendupali',
      user: 'Local User 1',
      issue: 'Claim status shows as pending but should be approved',
      status: 'open',
      date: '2024-01-15',
      priority: 'high'
    },
    {
      id: 2,
      village: 'Village ABC',
      user: 'Local User 2',
      issue: 'Incorrect land area calculation',
      status: 'in-progress',
      date: '2024-01-14',
      priority: 'medium'
    },
    {
      id: 3,
      village: 'Village XYZ',
      user: 'Local User 3',
      issue: 'Missing documentation in claim',
      status: 'resolved',
      date: '2024-01-10',
      priority: 'low'
    }
  ]);
  const [filters, setFilters] = useState({
    state: 'all-states',
    district: 'all-districts',
    status: 'all-status'
  });
  const isMobile = useIsMobile();
  const { currentUser, logout, userRole } = useAuth();

  const handleVillageSelect = (village: Village) => {
    setSelectedVillage(village);
    setEditedVillage({ ...village });
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedVillage(null);
    setEditedVillage(null);
    setIsEditing(false);
  };

  const handleCloseControlPanel = () => {
    setIsControlPanelOpen(false);
  };

  const handleLogout = async () => {
    console.log('GovernmentDashboard: Logout button clicked');
    try {
      await logout();
      console.log('GovernmentDashboard: Logout completed');
      
      // Force redirect as backup
      setTimeout(() => {
        console.log('GovernmentDashboard: Forcing redirect to landing page');
        window.location.href = '/';
      }, 200);
      
    } catch (error) {
      console.error('GovernmentDashboard: Failed to log out:', error);
      // Force redirect even on error
      window.location.href = '/';
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // In a real app, you would save to your backend here
    if (editedVillage) {
      setSelectedVillage(editedVillage);
      // Update the village in your data store
      console.log('Saving village:', editedVillage);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedVillage(selectedVillage);
    setIsEditing(false);
  };

  const handleStatusChange = (newStatus: 'approved' | 'pending' | 'rejected') => {
    if (editedVillage) {
      const statusMap = {
        'approved': 'Approved' as const,
        'pending': 'Pending' as const,
        'rejected': 'Rejected' as const
      };
      setEditedVillage({ ...editedVillage, status: statusMap[newStatus] });
    }
  };

  const handleComplaintStatusChange = (complaintId: number, newStatus: string) => {
    setComplaints(complaints.map(complaint => 
      complaint.id === complaintId 
        ? { ...complaint, status: newStatus }
        : complaint
    ));
  };

  const handleCreateAlert = (alertData: Omit<AlertType, 'id' | 'createdAt' | 'createdBy'>) => {
    const newAlert: AlertType = {
      ...alertData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.displayName || 'Government User'
    };
    setAlerts([newAlert, ...alerts]);
  };

  const handleUpdateAlert = (id: string, updates: Partial<AlertType>) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, ...updates } : alert
    ));
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
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
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Grid3X3 },
                { id: 'map', label: 'Map', icon: MapPin },
                { id: 'alerts', label: 'Alerts', icon: Bell },
                { id: 'complaints', label: 'Complaints', icon: AlertTriangle },
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
                className="border-2 border-white/40 text-white hover:bg-white/20 hover:border-white/60 px-3 py-2 rounded-lg"
              >
                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>

            {/* Desktop User Info and Logout */}
            <div className="hidden md:flex items-center space-x-2">
              <Badge className="bg-white text-black">
                <Shield className="w-3 h-3 mr-1" />
                Government User
              </Badge>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-white" />
                <span className="text-sm text-white">
                  {currentUser?.displayName || currentUser?.email}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center space-x-1 border-2 border-white/40 text-white hover:bg-white/20 hover:border-white/60 px-3 py-2 rounded-lg font-medium transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-white/20 bg-gray-900">
              <div className="pt-4 space-y-2">
                {/* Mobile Navigation Tabs */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    { id: 'dashboard', label: 'Dashboard', icon: Grid3X3 },
                    { id: 'map', label: 'Map', icon: MapPin },
                    { id: 'alerts', label: 'Alerts', icon: Bell },
                    { id: 'complaints', label: 'Complaints', icon: AlertTriangle },
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
                        className={`flex items-center space-x-2 font-semibold px-3 py-2 rounded-lg transition-all duration-200 ${
                          activeTab === tab.id 
                            ? 'bg-blue-600 text-white shadow-lg border-2 border-blue-500 hover:bg-blue-700' 
                            : 'border-2 border-gray-300 text-gray-800 bg-white hover:bg-gray-100 hover:border-gray-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{tab.label}</span>
                      </Button>
                    );
                  })}
                </div>

                {/* Mobile User Info and Logout */}
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-300">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800 border border-green-200">
                      <Shield className="w-3 h-3 mr-1" />
                      Government User
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-700" />
                    <span className="text-sm text-gray-700 font-medium">
                      {currentUser?.displayName || currentUser?.email}
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout}
                    className="flex items-center space-x-1 border-2 border-red-300 text-red-700 bg-white hover:bg-red-50 hover:border-red-400 px-3 py-2 rounded-lg font-medium transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
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
          <div className="fixed top-20 left-4 z-50">
            <Button
              onClick={() => setIsControlPanelOpen(!isControlPanelOpen)}
              className="bg-white text-black shadow-lg border-2 border-gray-300 hover:bg-gray-100"
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

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="flex-1 p-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Government Dashboard</h2>
              <p className="text-muted-foreground">Overview of forest rights administration</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Claims</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">1,234</div>
                  <p className="text-sm text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Approved Claims</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">856</div>
                  <p className="text-sm text-muted-foreground">69% approval rate</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pending Complaints</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600">23</div>
                  <p className="text-sm text-muted-foreground">Requires attention</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Map View */}
        {activeTab === 'map' && (
          <div className="flex-1 p-2 sm:p-4">
            <MapView onVillageSelect={handleVillageSelect} selectedFilters={filters} userType="government" />
          </div>
        )}

        {/* Alerts Management View */}
        {activeTab === 'alerts' && (
          <div className="flex-1 p-4">
            <AlertManagement
              alerts={alerts}
              onCreateAlert={handleCreateAlert}
              onUpdateAlert={handleUpdateAlert}
              onDeleteAlert={handleDeleteAlert}
            />
          </div>
        )}

        {/* Complaints View */}
        {activeTab === 'complaints' && (
          <div className="flex-1 p-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Complaints & Issues</h2>
              <p className="text-muted-foreground">Manage complaints submitted by local users</p>
            </div>
            
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <Card key={complaint.id} className="border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{complaint.village}</CardTitle>
                        <CardDescription>
                          Reported by {complaint.user} on {complaint.date}
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
                    <p className="text-foreground mb-4">{complaint.issue}</p>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleComplaintStatusChange(complaint.id, 'in-progress')}
                        disabled={complaint.status === 'in-progress'}
                        className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                          complaint.status === 'in-progress' 
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-300 cursor-not-allowed' 
                            : 'border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-50 hover:border-yellow-500'
                        }`}
                      >
                        <Clock className="w-4 h-4 mr-1" />
                        In Progress
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleComplaintStatusChange(complaint.id, 'resolved')}
                        disabled={complaint.status === 'resolved'}
                        className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                          complaint.status === 'resolved' 
                            ? 'bg-green-100 text-green-800 border-green-300 cursor-not-allowed' 
                            : 'border-2 border-green-400 text-green-700 hover:bg-green-50 hover:border-green-500'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Resolve
                      </Button>
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
              <p className="text-muted-foreground">Comprehensive analytics and reporting</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Claims</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">1,234</div>
                  <p className="text-sm text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Approved Claims</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">856</div>
                  <p className="text-sm text-muted-foreground">69% approval rate</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pending Complaints</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600">23</div>
                  <p className="text-sm text-muted-foreground">Requires attention</p>
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

      {/* Details Drawer with Edit Capabilities */}
      <DetailsDrawer
        village={selectedVillage}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        isMobile={isMobile}
        isGovernmentUser={true}
        isEditing={isEditing}
        editedVillage={editedVillage}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default GovernmentDashboard;
