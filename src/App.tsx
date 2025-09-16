import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import SecretShortcut from "@/components/SecretShortcut";
import Landing from "./pages/Landing";
// Role selection removed from user flow
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

  // CHANGED: Default anonymous users to a limited LocalDashboard instead of Landing page
  // Old behavior kept here for reference
  // if (!currentUser) {
  //   console.log('No current user, showing Landing page');
  //   return <Landing />;
  // }
  if (!currentUser) {
    return <LocalDashboard />; // limited mode will be handled inside the component
  }

  if (!userRole) {
    // Default to user dashboard when no explicit role is set
    return <LocalDashboard />;
  }

  if (userRole === 'government') {
    return <GovernmentDashboard />;
  }

  if (userRole === 'local') {
    return <LocalDashboard />;
  }

  return <LocalDashboard />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SecretShortcut />
          <Routes>
            <Route path="/" element={<RoleBasedRouter />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            {/* Role selection route removed */}
            {/* Wrapped with role-based protection. Only government role can access. */}
            {/* <Route path="/government-dashboard" element={<GovernmentDashboard />} /> */}
            <Route 
              path="/government-dashboard" 
              element={
                <ProtectedRoute requiredRole="government">
                  <GovernmentDashboard />
                </ProtectedRoute>
              } 
            />
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
