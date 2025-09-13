import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  Megaphone, 
  FileText,
  MapPin,
  Calendar,
  Clock,
  Filter,
  Search,
  Download
} from 'lucide-react';
import { Alert as AlertType } from '@/data/mockData';

interface AlertViewerProps {
  alerts: AlertType[];
  onAlertClick?: (alert: AlertType) => void;
}

const AlertViewer: React.FC<AlertViewerProps> = ({ alerts, onAlertClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.village?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || alert.type === filterType;
    const matchesPriority = filterPriority === 'all' || alert.priority === filterPriority;
    
    return matchesSearch && matchesType && matchesPriority && alert.isActive;
  });

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'scheme': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'announcement': return <Megaphone className="w-5 h-5 text-purple-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'update': return <Info className="w-5 h-5 text-green-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
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

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Alerts & Announcements</h2>
        <p className="text-muted-foreground">Stay updated with the latest information from the government</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="scheme">Schemes</SelectItem>
                  <SelectItem value="announcement">Announcements</SelectItem>
                  <SelectItem value="warning">Warnings</SelectItem>
                  <SelectItem value="update">Updates</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Alerts Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterType !== 'all' || filterPriority !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'No active alerts at the moment'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <Card 
              key={alert.id} 
              className={`border transition-all duration-200 hover:shadow-md ${
                isExpired(alert.expiresAt) ? 'opacity-60' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <span>{alert.title}</span>
                        {isExpired(alert.expiresAt) && (
                          <Badge variant="outline" className="text-gray-500">
                            Expired
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-2 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {alert.village && `${alert.village}, `}
                          {alert.district}, {alert.state}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getTypeColor(alert.type)}>
                      {alert.type.toUpperCase()}
                    </Badge>
                    <Badge className={getPriorityColor(alert.priority)}>
                      {alert.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-foreground mb-4 leading-relaxed">{alert.message}</p>
                
                {/* Attachments */}
                {alert.attachments && alert.attachments.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-foreground mb-2">Attachments:</h4>
                    <div className="flex flex-wrap gap-2">
                      {alert.attachments.map((attachment, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          {attachment}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <span>By: {alert.createdBy}</span>
                    <span>•</span>
                    <span>Target: {alert.targetAudience}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(alert.createdAt).toLocaleDateString()}</span>
                    </div>
                    {alert.expiresAt && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {isExpired(alert.expiresAt) ? 'Expired' : `Expires: ${new Date(alert.expiresAt).toLocaleDateString()}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Showing {filteredAlerts.length} of {alerts.length} alerts
            </span>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>High Priority</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Medium Priority</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Low Priority</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertViewer;
