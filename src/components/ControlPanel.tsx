import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Search, Filter, TrendingUp, Users, MapPin, FileCheck, AlertCircle, X } from 'lucide-react';
import { mockStates, mockStatistics, mockRecommendations } from '@/data/mockData';

interface ControlPanelProps {
  selectedFilters: {
    state: string;
    district: string;
    status: string;
  };
  onFilterChange: (filters: any) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ selectedFilters, onFilterChange, onClose, isMobile = false }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const pieData = [
    { name: 'Approved', value: mockStatistics.approvedClaims, color: 'hsl(var(--status-approved))' },
    { name: 'Pending', value: mockStatistics.pendingClaims, color: 'hsl(var(--status-pending))' },
    { name: 'Rejected', value: mockStatistics.rejectedClaims, color: 'hsl(var(--status-rejected))' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="h-full bg-dashboard-sidebar overflow-y-auto mobile-scroll">
      {/* Mobile Header */}
      {isMobile && (
        <div className="sticky top-0 bg-dashboard-sidebar border-b p-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-semibold">Control Panel</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
      
      <Tabs defaultValue="filters" className="w-full">
        <TabsList className={`grid w-full grid-cols-4 bg-card ${isMobile ? 'm-2 mb-2' : 'm-4 mb-2'}`}>
          <TabsTrigger value="filters" className="text-xs">Filters</TabsTrigger>
          <TabsTrigger value="stats" className="text-xs">Stats</TabsTrigger>
          <TabsTrigger value="recommendations" className="text-xs">Schemes</TabsTrigger>
          <TabsTrigger value="documents" className="text-xs">Docs</TabsTrigger>
        </TabsList>

        <div className={`${isMobile ? 'px-2 pb-4' : 'px-4 pb-4'}`}>
          <TabsContent value="filters" className="space-y-4 mt-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Search & Filter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search villages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">State</label>
                    <Select 
                      value={selectedFilters.state} 
                      onValueChange={(value) => onFilterChange({ ...selectedFilters, state: value, district: '' })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-states">All States</SelectItem>
                        {mockStates.map((state) => {
                          const isHighlightedState = ['Madhya Pradesh', 'Odisha', 'Telangana', 'Tripura'].includes(state.name);
                          return (
                            <SelectItem 
                              key={state.name} 
                              value={state.name}
                              className={isHighlightedState ? "text-red-500 font-semibold bg-red-50" : ""}
                            >
                              {isHighlightedState && "🔴 "}{state.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">District</label>
                    <Select 
                      value={selectedFilters.district}
                      onValueChange={(value) => onFilterChange({ ...selectedFilters, district: value })}
                      disabled={!selectedFilters.state}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select District" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-districts">All Districts</SelectItem>
                        {selectedFilters.state && mockStates
                          .find(s => s.name === selectedFilters.state)?.districts
                          .map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Status</label>
                    <Select 
                      value={selectedFilters.status}
                      onValueChange={(value) => onFilterChange({ ...selectedFilters, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-status">All Status</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={() => onFilterChange({ state: 'all-states', district: 'all-districts', status: 'all-status' })}
                    variant="outline" 
                    className="w-full"
                    size="sm"
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4 mt-2">
            <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
              <Card className="p-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Total Villages</p>
                    <p className="text-lg font-bold">{mockStatistics.totalVillages.toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-3">
                <div className="flex items-center space-x-2">
                  <FileCheck className="w-4 h-4 text-status-approved" />
                  <div>
                    <p className="text-xs text-muted-foreground">Approved</p>
                    <p className="text-lg font-bold text-status-approved">{mockStatistics.approvedClaims.toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-3">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-status-pending" />
                  <div>
                    <p className="text-xs text-muted-foreground">Pending</p>
                    <p className="text-lg font-bold text-status-pending">{mockStatistics.pendingClaims.toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-3">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-secondary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Forest Cover</p>
                    <p className="text-lg font-bold text-secondary">{mockStatistics.forestCoverPercent}%</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Claims Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Monthly Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={mockStatistics.monthlyGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={10} />
                    <YAxis fontSize={10} />
                    <Tooltip />
                    <Bar dataKey="approved" fill="hsl(var(--status-approved))" />
                    <Bar dataKey="pending" fill="hsl(var(--status-pending))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-3 mt-2">
            {mockRecommendations.map((rec) => (
              <Card key={rec.id} className="p-3">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-sm">{rec.title}</h4>
                    <Badge className={`text-white text-xs ${getPriorityColor(rec.priority)}`}>
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{rec.description}</p>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{rec.villages} villages</span>
                    <span className="text-secondary font-medium">{rec.estimatedImpact} impact</span>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="documents" className="space-y-4 mt-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Document Viewer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-lg p-6 text-center">
                  <FileCheck className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">
                    Select a village to view related documents
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    Upload Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ControlPanel;