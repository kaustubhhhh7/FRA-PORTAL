import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Users, 
  MapPin, 
  FileText, 
  BarChart3, 
  CheckCircle,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

const RoleSelection: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { currentUser, updateUserRole } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelection = async (role: 'government' | 'local') => {
    try {
      setLoading(true);
      await updateUserRole(role);
      
      if (role === 'government') {
        navigate('/government-dashboard');
      } else {
        navigate('/local-dashboard');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      id: 'government',
      title: 'Government User',
      icon: Shield,
      description: 'Full administrative access to manage forest rights claims',
      features: [
        'Approve, deny, or set claims to pending',
        'View and respond to user complaints',
        'Edit claim details and status',
        'Access comprehensive analytics',
        'Manage user permissions',
        'Generate reports and insights'
      ],
      color: 'bg-black text-white',
      badgeColor: 'bg-gray-100 text-gray-800'
    },
    {
      id: 'local',
      title: 'User',
      icon: Users,
      description: 'View forest rights information and submit complaints',
      features: [
        'View forest rights claims status',
        'Submit complaints and issues',
        'Track claim progress',
        'Access basic analytics',
        'View approved claims',
        'Report discrepancies'
      ],
      color: 'bg-white text-black border-2 border-black',
      badgeColor: 'bg-gray-100 text-gray-800'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
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
            
            <div className="flex items-center space-x-2">
              <Badge className="bg-white text-black">
                Welcome, {currentUser?.displayName || currentUser?.email}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Choose Your Role
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select your role to access the appropriate dashboard and features for your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <Card 
                key={role.id} 
                className={`group card-interactive border-2 ${
                  isSelected ? 'border-black shadow-lg ring-4 ring-gray-200' : 'border-gray-200'
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <CardHeader className="text-center">
                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${role.color}`}>
                    <Icon className="w-10 h-10" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{role.title}</CardTitle>
                  <CardDescription className="text-lg">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground mb-3">Key Features:</h4>
                    {role.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-black flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t">
                    <Button
                      className={`w-full btn-primary ${isSelected ? 'ring-4 ring-gray-300' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRoleSelection(role.id as 'government' | 'local');
                      }}
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : `Continue as ${role.title}`}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Information Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <div className="flex items-center space-x-2 mb-4">
                <AlertCircle className="w-6 h-6 text-black" />
                <CardTitle className="text-xl">Important Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Government Users</h4>
                  <p className="text-muted-foreground text-sm">
                    Have full administrative control over forest rights claims. Can approve, deny, 
                    edit status, and respond to user complaints. Changes made by government users 
                    are immediately reflected in local user dashboards.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Users</h4>
                  <p className="text-muted-foreground text-sm">
                    Can view forest rights information, track claim progress, and submit complaints 
                    or issues. Local users cannot edit claim status but can report discrepancies 
                    for government review.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
