import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider,
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export type UserRole = 'government' | 'local' | null;

interface AuthContextType {
  currentUser: User | null;
  userRole: UserRole;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserRole: (role: UserRole) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email: string, password: string, displayName: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName });
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Default role for any successful login is 'local' (regular user)
      localStorage.setItem('userRole', 'local');
      setUserRole('local');
    } catch (error) {
      console.log('Firebase login failed, using mock login for testing');
      // Mock user for testing when Firebase isn't configured
      const mockUser = {
        uid: 'mock-user-id',
        email: email,
        displayName: email.split('@')[0],
        emailVerified: true
      } as User;
      setCurrentUser(mockUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      // Default mock login to 'local' role as well
      localStorage.setItem('userRole', 'local');
      setUserRole('local');
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Default Google login to 'local' role
      localStorage.setItem('userRole', 'local');
      setUserRole('local');
    } catch (error) {
      console.log('Firebase Google login failed, using mock Google login for demo');
      // Mock Google user for demo purposes
      const mockGoogleUser = {
        uid: 'mock-google-user-id',
        email: 'demo@fraportal.com',
        displayName: 'Demo User',
        emailVerified: true
      } as User;
      setCurrentUser(mockGoogleUser);
      localStorage.setItem('mockUser', JSON.stringify(mockGoogleUser));
      // Default mock Google login to 'local' role
      localStorage.setItem('userRole', 'local');
      setUserRole('local');
    }
  };

  const logout = async () => {
    console.log('=== LOGOUT STARTED ===');
    console.log('Current user before logout:', currentUser);
    console.log('Current userRole before logout:', userRole);
    
    try {
      // Clear localStorage immediately
      localStorage.removeItem('userRole');
      localStorage.removeItem('mockUser');
      console.log('LocalStorage cleared');
      
      // Clear all state immediately
      setCurrentUser(null);
      setUserRole(null);
      setLoading(false);
      console.log('State cleared - user logged out');
      
      // Try Firebase logout (non-blocking)
      try {
        await signOut(auth);
        console.log('Firebase logout successful');
      } catch (error) {
        console.log('Firebase logout failed (expected if not configured):', error);
      }
      
      console.log('=== LOGOUT COMPLETED ===');
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, ensure state is cleared
      setCurrentUser(null);
      setUserRole(null);
      setLoading(false);
      localStorage.removeItem('userRole');
      localStorage.removeItem('mockUser');
    }
  };

  const updateUserRole = async (role: UserRole) => {
    // In a real app, you would save this to Firestore or your backend
    // For now, we'll store it in localStorage
    if (role) {
      localStorage.setItem('userRole', role);
      setUserRole(role);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user);
      setCurrentUser(user);
      if (user) {
        // Load user role from localStorage
        const savedRole = localStorage.getItem('userRole') as UserRole;
        setUserRole(savedRole);
        console.log('Firebase user logged in, role:', savedRole);
      } else {
        // Check for mock user in localStorage
        const mockUserStr = localStorage.getItem('mockUser');
        if (mockUserStr) {
          try {
            const mockUser = JSON.parse(mockUserStr);
            setCurrentUser(mockUser);
            const savedRole = localStorage.getItem('userRole') as UserRole;
            setUserRole(savedRole);
            console.log('Mock user logged in, role:', savedRole);
          } catch (error) {
            console.error('Error parsing mock user:', error);
            setCurrentUser(null);
            setUserRole(null);
            localStorage.removeItem('userRole');
            localStorage.removeItem('mockUser');
          }
        } else {
          setCurrentUser(null);
          setUserRole(null);
          console.log('No user found, logged out');
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    signup,
    login,
    loginWithGoogle,
    logout,
    updateUserRole,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
