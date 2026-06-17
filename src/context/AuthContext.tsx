import React, { createContext, useContext, useState } from 'react';

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
  login: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<UserRole, User> = {
  student: {
    id: 'usr_stud_001',
    name: 'Aravind Swamy',
    email: 'aravind.s@student.edu',
    role: 'student',
    details: {
      studentId: '2023CS8042',
      department: 'Computer Science & Engineering',
    },
  },
  coordinator: {
    id: 'usr_coord_001',
    name: 'Dr. Priya Ramaswamy',
    email: 'priya.r@university.edu',
    role: 'coordinator',
    details: {
      department: 'Information Technology',
      title: 'Senior Internship Coordinator',
    },
  },
  organization: {
    id: 'usr_org_001',
    name: 'TechCorp Solutions',
    email: 'hiring@techcorp.com',
    role: 'organization',
    details: {
      organizationName: 'TechCorp Labs',
      title: 'Talent Acquisition Director',
    },
  },
  admin: {
    id: 'usr_admin_001',
    name: 'System Administrator',
    email: 'admin@simp.org',
    role: 'admin',
    details: {
      title: 'Global System Manager',
    },
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('simp_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (role: UserRole) => {
    const mockUser = mockUsers[role];
    setUser(mockUser);
    localStorage.setItem('simp_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('simp_user');
  };

  const switchRole = (role: UserRole) => {
    login(role);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, switchRole }}>
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
