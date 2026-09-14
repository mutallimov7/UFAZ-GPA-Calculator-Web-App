import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../types.ts';
import { api, clearStoredToken, getStoredToken } from '../services/api.ts';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (identifier: string, pass: string) => Promise<void>;
  setPasswordDirect: (identifier: string, pass: string) => Promise<void>;
  requestOtp: (identifier: string) => Promise<{
    studentId: string;
    email: string;
    fullName: string;
    simulatedOtp: string;
    message: string;
  }>;
  activateAccount: (studentId: string, otp: string, pass: string) => Promise<void>;
  requestPasswordReset: (identifier: string) => Promise<{
    studentId: string;
    email: string;
    fullName: string;
    simulatedOtp: string;
    message: string;
  }>;
  resetPassword: (identifier: string, otp: string, newPass: string) => Promise<void>;
  switchUser: (role: 'student' | 'admin') => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.getMe();
      setUser(res.user);
    } catch {
      clearStoredToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    const handleUnauthorized = () => {
      setUser(null);
    };
    window.addEventListener('ufaz_unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('ufaz_unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (identifier: string, pass: string) => {
    const res = await api.login(identifier, pass);
    setUser(res.user);
  };

  const setPasswordDirect = async (identifier: string, pass: string) => {
    const res = await api.setPasswordDirect(identifier, pass);
    setUser(res.user);
  };

  const requestOtp = async (identifier: string) => {
    return api.requestOtp(identifier);
  };

  const activateAccount = async (studentId: string, otp: string, pass: string) => {
    const res = await api.activateAccount(studentId, otp, pass);
    setUser(res.user);
  };

  const requestPasswordReset = async (identifier: string) => {
    return api.requestPasswordReset(identifier);
  };

  const resetPassword = async (identifier: string, otp: string, newPass: string) => {
    const res = await api.resetPassword(identifier, otp, newPass);
    setUser(res.user);
  };

  const switchUser = async (role: 'student' | 'admin') => {
    setLoading(true);
    try {
      const res = await api.switchUser(role);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await api.getMe();
      setUser(res.user);
    } catch (e) {
      console.error(e);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        setPasswordDirect,
        requestOtp,
        activateAccount,
        requestPasswordReset,
        resetPassword,
        switchUser,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
