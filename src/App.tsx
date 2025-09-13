import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import RoleSelection from "./pages/RoleSelection";
import GovernmentDashboard from "./pages/GovernmentDashboard";
import LocalDashboard from "./pages/LocalDashboard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to handle role-based routing
const RoleBasedRouter = () => {
  const { currentUser, userRole, loading } = useAuth();

  console.log('=== ROLEBASEDROUTER RENDER ===');
  console.log('RoleBasedRouter - currentUser:', currentUser);
  console.log('RoleBasedRouter - userRole:', userRole);
  console.log('RoleBasedRouter - loading:', loading);

  // Show loading state while authentication is being checked
  if (loading) {
    console.log('Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    console.log('No current user, showing Landing page');
    return <Landing />;
  }

  if (!userRole) {
    return <RoleSelection />;
  }

  if (userRole === 'government') {
    return <GovernmentDashboard />;
  }

  if (userRole === 'local') {
    return <LocalDashboard />;
  }

  return <RoleSelection />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RoleBasedRouter />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route path="/government-dashboard" element={<GovernmentDashboard />} />
            <Route path="/local-dashboard" element={<LocalDashboard />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
