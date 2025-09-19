import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/Header';
import { Input } from '@/components/ui/input';
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
  Menu,
  TreePine,
  FileScan
} from 'lucide-react';
import MapView from '@/components/MapView';
import ControlPanel from '@/components/ControlPanel';
import DetailsDrawer from '@/components/DetailsDrawer';
import AlertManagement from '@/components/AlertManagement';
import ForestLayout from '@/components/ForestLayout';
import { Village, Alert as AlertType, ForestArea, mockAlerts } from '@/data/mockData';
import { useIsMobile } from '@/hooks/use-mobile';

const GovernmentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);
  const [selectedForest, setSelectedForest] = useState<ForestArea | null>(null);
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

  const handleForestSelect = (forest: ForestArea) => {
    setSelectedForest(forest);
    console.log('Selected forest:', forest);
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
      
      // Force redirect immediately
      window.location.href = '/';
      
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
      {/* Header with Sign In button */}
      <Header 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onToggleControlPanel={() => setIsControlPanelOpen(!isControlPanelOpen)}
        isControlPanelOpen={isControlPanelOpen}
      />


      {/* Main Content */}
      <div className="flex flex-1 h-[calc(100vh-80px)] relative">
        {/* Mobile Control Panel Toggle */}
        {isMobile && !selectedForest && (
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
        {isMobile && !selectedForest && isControlPanelOpen && (
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
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground mb-2">Government Dashboard</h2>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => { window.location.href = '/analyze-documents'; }}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  <FileScan className="w-4 h-4 mr-2" />
                  Analyze Documents
                </Button>
              </div>
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

        {/* Map View with Forest Options */}
        {activeTab === 'map' && (
          <div className="flex-1 flex flex-col">
            {/* Forest Options Submenu */}
            <div className="bg-white border-b px-4 py-2">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-semibold text-gray-800">Map & Forest Areas</h3>
                <div className="flex space-x-2">
                  <Button
                    variant={selectedForest ? "outline" : "default"}
                    size="sm"
                    onClick={() => setSelectedForest(null)}
                    className="flex items-center space-x-1"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Map View</span>
                  </Button>
                  <Button
                    variant={selectedForest ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedForest({} as ForestArea)}
                    className="flex items-center space-x-1"
                  >
                    <TreePine className="w-4 h-4" />
                    <span>Forest Areas</span>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Map or Forest Content */}
            <div className="flex-1">
              {!selectedForest ? (
                <div className="h-full p-2 sm:p-4">
                  <MapView onVillageSelect={handleVillageSelect} selectedFilters={filters} userType="government" />
                </div>
              ) : (
                <div className="h-full">
                  <ForestLayout onForestSelect={handleForestSelect} userType="government" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dashboard/Home View */}
        {activeTab === 'dashboard' && (
          <div className="flex-1 p-4">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">FRA Implementation Status</h2>
                <p className="text-muted-foreground">Status on implementation of FRA in Odisha as on 31-12-2024</p>
              </div>
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Data
              </Button>
            </div>
            
            {/* FRA Data Grid */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-lg p-6 shadow-lg border border-amber-200">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-amber-300">
                      <th className="text-left py-3 px-4 font-semibold text-amber-800 bg-amber-100">Activities</th>
                      <th className="text-center py-3 px-4 font-semibold text-amber-800 bg-amber-100">Individual Rights</th>
                      <th className="text-center py-3 px-4 font-semibold text-amber-800 bg-amber-100">Community Rights</th>
                      <th className="text-center py-3 px-4 font-semibold text-amber-800 bg-amber-100">Community Forest Resources Rights</th>
                      <th className="text-center py-3 px-4 font-semibold text-amber-800 bg-amber-100">Total of Community</th>
                      <th className="text-center py-3 px-4 font-semibold text-amber-800 bg-amber-100">Grand Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-amber-200 hover:bg-amber-50">
                      <td className="py-3 px-4 font-medium text-amber-900">Claims Received</td>
                      <td className="py-3 px-4 text-center text-amber-800">691,948</td>
                      <td className="py-3 px-4 text-center text-amber-800">17,265</td>
                      <td className="py-3 px-4 text-center text-amber-800">15,179</td>
                      <td className="py-3 px-4 text-center text-amber-800">32,444</td>
                      <td className="py-3 px-4 text-center font-semibold text-amber-900">724,392</td>
                    </tr>
                    <tr className="border-b border-amber-200 hover:bg-amber-50">
                      <td className="py-3 px-4 font-medium text-amber-900">Claims Approved</td>
                      <td className="py-3 px-4 text-center text-amber-800">468,133</td>
                      <td className="py-3 px-4 text-center text-amber-800">6,323</td>
                      <td className="py-3 px-4 text-center text-amber-800">4,903</td>
                      <td className="py-3 px-4 text-center text-amber-800">11,226</td>
                      <td className="py-3 px-4 text-center font-semibold text-amber-900">479,359</td>
                    </tr>
                    <tr className="border-b border-amber-200 hover:bg-amber-50">
                      <td className="py-3 px-4 font-medium text-amber-900">Titles Distributed</td>
                      <td className="py-3 px-4 text-center text-amber-800">461,475</td>
                      <td className="py-3 px-4 text-center text-amber-800">4,784</td>
                      <td className="py-3 px-4 text-center text-amber-800">3,992</td>
                      <td className="py-3 px-4 text-center text-amber-800">8,776</td>
                      <td className="py-3 px-4 text-center font-semibold text-amber-900">470,251</td>
                    </tr>
                    <tr className="border-b border-amber-200 hover:bg-amber-50">
                      <td className="py-3 px-4 font-medium text-amber-900">Area Involved</td>
                      <td className="py-3 px-4 text-center text-amber-800">673,850.89 Acres</td>
                      <td className="py-3 px-4 text-center text-amber-800">278,154.02 Acres</td>
                      <td className="py-3 px-4 text-center text-amber-800">458,734.83 Acres</td>
                      <td className="py-3 px-4 text-center text-amber-800">736,888.85 Acres</td>
                      <td className="py-3 px-4 text-center font-semibold text-amber-900">1,410,739.74 Acres</td>
                    </tr>
                    <tr className="border-b border-amber-200 hover:bg-amber-50">
                      <td className="py-3 px-4 font-medium text-amber-900">Claims Rejected</td>
                      <td className="py-3 px-4 text-center text-amber-800">144,104</td>
                      <td className="py-3 px-4 text-center text-amber-800">404</td>
                      <td className="py-3 px-4 text-center text-amber-800">128</td>
                      <td className="py-3 px-4 text-center text-amber-800">532</td>
                      <td className="py-3 px-4 text-center font-semibold text-amber-900">144,636</td>
                    </tr>
                    <tr className="border-b border-amber-200 hover:bg-amber-50">
                      <td className="py-3 px-4 font-medium text-amber-900">Claims Pending</td>
                      <td className="py-3 px-4 text-center text-amber-800">86,369</td>
                      <td className="py-3 px-4 text-center text-amber-800">12,077</td>
                      <td className="py-3 px-4 text-center text-amber-800">11,059</td>
                      <td className="py-3 px-4 text-center text-amber-800">23,136</td>
                      <td className="py-3 px-4 text-center font-semibold text-amber-900">109,505</td>
                    </tr>
                    <tr className="border-b border-amber-200 hover:bg-amber-50">
                      <td className="py-3 px-4 font-medium text-amber-900">Correction of RoR & Maps</td>
                      <td className="py-3 px-4 text-center text-amber-800">—</td>
                      <td className="py-3 px-4 text-center text-amber-800">355,438</td>
                      <td className="py-3 px-4 text-center text-amber-800">—</td>
                      <td className="py-3 px-4 text-center text-amber-800">Demarcation made</td>
                      <td className="py-3 px-4 text-center font-semibold text-amber-900">428,966</td>
                    </tr>
                    <tr className="border-b border-amber-200 hover:bg-amber-50">
                      <td className="py-3 px-4 font-medium text-amber-900">Conversion Claims of Forest to Revenue Village</td>
                      <td className="py-3 px-4 text-center text-amber-800">—</td>
                      <td className="py-3 px-4 text-center text-amber-800">57</td>
                      <td className="py-3 px-4 text-center text-amber-800">—</td>
                      <td className="py-3 px-4 text-center text-amber-800">Declared Conversion of Forest to Revenue Village</td>
                      <td className="py-3 px-4 text-center font-semibold text-amber-900">165</td>
                    </tr>
                    <tr className="hover:bg-amber-50">
                      <td className="py-3 px-4 font-medium text-amber-900">Habitat Rights Recognition Claims</td>
                      <td className="py-3 px-4 text-center text-amber-800">—</td>
                      <td className="py-3 px-4 text-center text-amber-800">14</td>
                      <td className="py-3 px-4 text-center text-amber-800">—</td>
                      <td className="py-3 px-4 text-center text-amber-800">Habitat Rights Recognition Approved</td>
                      <td className="py-3 px-4 text-center font-semibold text-amber-900">10</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Edit Modal for Government Users */}
            {isEditing && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Edit FRA Implementation Data</h3>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        You are editing official FRA implementation data. Changes will be visible to all users.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Claims Received - Individual Rights</label>
                        <Input defaultValue="691,948" className="w-full" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Claims Received - Community Rights</label>
                        <Input defaultValue="17,265" className="w-full" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Claims Received - Community Forest Resources Rights</label>
                        <Input defaultValue="15,179" className="w-full" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Claims Approved - Individual Rights</label>
                        <Input defaultValue="468,133" className="w-full" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Claims Approved - Community Rights</label>
                        <Input defaultValue="6,323" className="w-full" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Claims Approved - Community Forest Resources Rights</label>
                        <Input defaultValue="4,903" className="w-full" />
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          // Here you would implement the save functionality
                          setIsEditing(false);
                          // Show success message
                        }}
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
        {!isMobile && !selectedForest && (
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
