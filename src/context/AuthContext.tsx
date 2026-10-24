import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  organization: string;
  district: string;
  role: 'Agronomist' | 'Agricultural Officer' | 'Research Scholar' | 'Farmer' | 'Policy Analyst';
  registeredAt: string;
}

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  register: (user: Omit<UserProfile, 'id' | 'registeredAt'> & { password?: string }) => { success: boolean; error?: string };
  login: (email: string, password?: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: UserProfile = {
  id: 'usr-1',
  name: 'Dr. Vaibhav Pareek',
  email: 'vaibhav.pareek@agri-rajasthan.gov.in',
  organization: 'Department of Agriculture & ICRISAT Research',
  district: 'Jaipur',
  role: 'Agronomist',
  registeredAt: '2026-03-15'
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('agri_current_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEMO_USER; // Default logged in as demo researcher for frictionless exploration
  });

  const [users, setUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('agri_registered_users');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [DEMO_USER];
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('agri_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('agri_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('agri_registered_users', JSON.stringify(users));
  }, [users]);

  const register = (data: Omit<UserProfile, 'id' | 'registeredAt'> & { password?: string }) => {
    if (!data.email || !data.name) {
      return { success: false, error: 'Full name and email are required.' };
    }

    const existing = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email,
      organization: data.organization || 'Agri Research Institute',
      district: data.district || 'Jaipur',
      role: data.role || 'Agronomist',
      registeredAt: new Date().toISOString().split('T')[0]
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const login = (email: string) => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      return { success: true };
    }
    // Allow login if matching default demo
    if (email === DEMO_USER.email) {
      setCurrentUser(DEMO_USER);
      return { success: true };
    }
    return { success: false, error: 'User not found. Please register first.' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated: !!currentUser, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
