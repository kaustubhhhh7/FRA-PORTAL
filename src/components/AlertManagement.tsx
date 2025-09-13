import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  MapPin, 
  Bell, 
  AlertTriangle, 
  Info, 
  Megaphone, 
  FileText,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock
} from 'lucide-react';
import { Alert as AlertType } from '@/data/mockData';

interface AlertManagementProps {
  alerts: AlertType[];
  onCreateAlert: (alert: Omit<AlertType, 'id' | 'createdAt' | 'createdBy'>) => void;
  onUpdateAlert: (id: string, alert: Partial<AlertType>) => void;
  onDeleteAlert: (id: string) => void;
  onMapClick?: (coordinates: [number, number]) => void;
}

const AlertManagement: React.FC<AlertManagementProps> = ({
  alerts,
  onCreateAlert,
  onUpdateAlert,
  onDeleteAlert,
  onMapClick
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAlert, setEditingAlert] = useState<AlertType | null>(null);
  const [newAlert, setNewAlert] = useState({
    title: '',
    message: '',
    type: 'announcement' as const,
    priority: 'medium' as const,
    coordinates: [0, 0] as [number, number],
    village: '',
    state: '',
    district: '',
    expiresAt: '',
    targetAudience: 'local' as const,
    attachments: [] as string[],
    isActive: true
  });

  const handleCreateAlert = () => {
    if (newAlert.title && newAlert.message && newAlert.state && newAlert.district) {
      onCreateAlert(newAlert);
      setNewAlert({
        title: '',
        message: '',
        type: 'announcement',
        priority: 'medium',
        coordinates: [0, 0],
        village: '',
        state: '',
        district: '',
        expiresAt: '',
        targetAudience: 'local',
        attachments: [],
        isActive: true
      });
      setShowCreateForm(false);
    }
  };

  const handleUpdateAlert = () => {
    if (editingAlert) {
      onUpdateAlert(editingAlert.id, editingAlert);
      setEditingAlert(null);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'scheme': return <FileText className="w-4 h-4" />;
      case 'announcement': return <Megaphone className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'update': return <Info className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'scheme': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'announcement': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'warning': return 'bg-red-100 text-red-800 border-red-200';
      case 'update': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Alert Management</h2>
          <p className="text-muted-foreground">Create and manage alerts for local users</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Alert
        </Button>
      </div>

      {/* Create Alert Form */}
      {showCreateForm && (
        <Card className="border-2 border-black">
          <CardHeader>
            <CardTitle>Create New Alert</CardTitle>
            <CardDescription>
              Create an alert that will be visible to local users on the map
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Alert Title</Label>
                <Input
                  id="title"
                  value={newAlert.title}
                  onChange={(e) => setNewAlert({...newAlert, title: e.target.value})}
                  placeholder="Enter alert title"
                  className="form-input"
                />
              </div>
              <div>
                <Label htmlFor="type">Alert Type</Label>
                <Select value={newAlert.type} onValueChange={(value: any) => setNewAlert({...newAlert, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheme">Scheme</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={newAlert.message}
                onChange={(e) => setNewAlert({...newAlert, message: e.target.value})}
                placeholder="Enter detailed message"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={newAlert.priority} onValueChange={(value: any) => setNewAlert({...newAlert, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={newAlert.state}
                  onChange={(e) => setNewAlert({...newAlert, state: e.target.value})}
                  placeholder="Enter state"
                />
              </div>
              <div>
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={newAlert.district}
                  onChange={(e) => setNewAlert({...newAlert, district: e.target.value})}
                  placeholder="Enter district"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="village">Village (Optional)</Label>
                <Input
                  id="village"
                  value={newAlert.village}
                  onChange={(e) => setNewAlert({...newAlert, village: e.target.value})}
                  placeholder="Enter village name"
                />
              </div>
              <div>
                <Label htmlFor="expiresAt">Expiry Date (Optional)</Label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={newAlert.expiresAt}
                  onChange={(e) => setNewAlert({...newAlert, expiresAt: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Select value={newAlert.targetAudience} onValueChange={(value: any) => setNewAlert({...newAlert, targetAudience: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">Local Users Only</SelectItem>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="government">Government Users Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleCreateAlert} className="btn-primary">
                Create Alert
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)} className="btn-outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alert) => (
          <Card key={alert.id} className="border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getAlertIcon(alert.type)}
                  <CardTitle className="text-lg">{alert.title}</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getTypeColor(alert.type)}>
                    {alert.type.toUpperCase()}
                  </Badge>
                  <Badge className={getPriorityColor(alert.priority)}>
                    {alert.priority.toUpperCase()}
                  </Badge>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingAlert(alert)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDeleteAlert(alert.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <CardDescription>
                {alert.village && `${alert.village}, `}{alert.district}, {alert.state}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-4">{alert.message}</p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <span>Created by: {alert.createdBy}</span>
                  <span>•</span>
                  <span>Target: {alert.targetAudience}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(alert.createdAt).toLocaleDateString()}</span>
                  {alert.expiresAt && (
                    <>
                      <Clock className="w-4 h-4 ml-2" />
                      <span>Expires: {new Date(alert.expiresAt).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Alert Modal */}
      {editingAlert && (
        <Card className="fixed inset-0 z-50 bg-background border-2 border-black m-4 max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <CardTitle>Edit Alert</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Alert Title</Label>
              <Input
                id="edit-title"
                value={editingAlert.title}
                onChange={(e) => setEditingAlert({...editingAlert, title: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-message">Message</Label>
              <Textarea
                id="edit-message"
                value={editingAlert.message}
                onChange={(e) => setEditingAlert({...editingAlert, message: e.target.value})}
                rows={4}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleUpdateAlert} className="bg-black text-white">
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setEditingAlert(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AlertManagement;
