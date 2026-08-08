import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';

export type UserRole = 'student' | 'coordinator' | 'organization' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  details?: {
    studentId?: string;
    department?: string;
    organizationName?: string;
    title?: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default credentials for testing environment quick switch
const testAccounts: Record<UserRole, { email: string; password: string }> = {
  student: { email: 'student@student.edu', password: 'password123' },
  coordinator: { email: 'coordinator@university.edu', password: 'password123' },
  organization: { email: 'org@company.com', password: 'password123' },
  admin: { email: 'admin@simp.org', password: 'password123' },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Auth State from LocalStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = localStorage.getItem('simp_user');
        const token = localStorage.getItem('simp_token');
        if (savedUser && token) {
          setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.error('Failed to load user session:', err);
        localStorage.removeItem('simp_user');
        localStorage.removeItem('simp_token');
        localStorage.removeItem('simp_refresh_token');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen to token expiration events from api.ts
    const handleAuthExpired = () => {
      setUser(null);
      localStorage.removeItem('simp_user');
      localStorage.removeItem('simp_token');
      localStorage.removeItem('simp_refresh_token');
      window.location.href = '/login';
    };

    window.addEventListener('simp_auth_expired', handleAuthExpired);
    return () => {
      window.removeEventListener('simp_auth_expired', handleAuthExpired);
    };
  }, []);

  const login = async (email: string, password: UserPassword) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      const { token, refreshToken, user: userData } = response;
      
      localStorage.setItem('simp_token', token);
      localStorage.setItem('simp_refresh_token', refreshToken);
      localStorage.setItem('simp_user', JSON.stringify(userData));
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  type UserPassword = string;

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      await authService.register(data);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      localStorage.removeItem('simp_token');
      localStorage.removeItem('simp_refresh_token');
      localStorage.removeItem('simp_user');
      setIsLoading(false);
    }
  };

  // Quick environment role switcher (for development & testing)
  const switchRole = async (role: UserRole) => {
    const creds = testAccounts[role];
    
    // For development/sandbox purposes: perform instant local login without using authentication/network
    const mockUser: User = {
      id: `mock_${role}_id`,
      name: `Sandbox ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      email: creds.email,
      role: role,
      details: {
        studentId: role === 'student' ? 'SANDBOX_STU' : undefined,
        department: (role === 'student' || role === 'coordinator') ? 'Computer Science' : undefined,
        organizationName: role === 'organization' ? 'Sandbox Org' : undefined,
        title: role === 'coordinator' ? 'Faculty Coordinator' : role === 'admin' ? 'System Administrator' : role === 'organization' ? 'HR Manager' : undefined,
      }
    };

    localStorage.setItem('simp_token', 'mock_jwt_token_for_development');
    localStorage.setItem('simp_refresh_token', 'mock_refresh_token');
    localStorage.setItem('simp_user', JSON.stringify(mockUser));
    setUser(mockUser);

    /* Original code kept intact:
    try {
      await login(creds.email, creds.password);
    } catch (err) {
      console.warn(`Test account for ${role} not found. Attempting sandbox registration...`);
      try {
        // Register a sandbox test account
        const registerData = {
          email: creds.email,
          password: creds.password,
          role,
          name: `Sandbox ${role.charAt(0).toUpperCase() + role.slice(1)}`,
          studentId: role === 'student' ? 'SANDBOX_STU' : undefined,
          department: (role === 'student' || role === 'coordinator') ? 'Computer Science' : undefined,
          employeeId: role === 'coordinator' ? 'SANDBOX_EMP' : undefined,
          designation: role === 'coordinator' ? 'Professor' : undefined,
          companyName: role === 'organization' ? 'Sandbox Org' : undefined,
          industry: role === 'organization' ? 'Tech' : undefined
        };
        await register(registerData);
        await login(creds.email, creds.password);
      } catch (regErr) {
        console.error(`Failed to sandbox switch to role ${role}:`, regErr);
        console.warn(`Backend connection failed. Falling back to local offline mock login for role: ${role}`);
        
        const mockUser: User = {
          id: `mock_${role}_id`,
          name: `Sandbox ${role.charAt(0).toUpperCase() + role.slice(1)}`,
          email: creds.email,
          role: role,
          details: {
            studentId: role === 'student' ? 'SANDBOX_STU' : undefined,
            department: (role === 'student' || role === 'coordinator') ? 'Computer Science' : undefined,
            organizationName: role === 'organization' ? 'Sandbox Org' : undefined,
            title: role === 'coordinator' ? 'Faculty Coordinator' : role === 'admin' ? 'System Administrator' : role === 'organization' ? 'HR Manager' : undefined,
          }
        };

        localStorage.setItem('simp_token', 'mock_jwt_token_for_development');
        localStorage.setItem('simp_refresh_token', 'mock_refresh_token');
        localStorage.setItem('simp_user', JSON.stringify(mockUser));
        setUser(mockUser);
      }
    }
    */
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
