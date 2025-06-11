// frontend/lib/AuthContext.tsx
"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  verificationSent: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  verificationSent: false,
  login: async () => {},
  signup: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
  resendVerificationEmail: async () => {},
});

// Custom hook to use the auth context
export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);

  // Initialize auth state on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing stored user:', e);
        localStorage.removeItem('user');
      }
    }
    
    // In a real application, we would subscribe to auth state changes
    // from Firebase or another auth provider
    setLoading(false);
  }, []);

  // Mock login function - in a real app, this would use Firebase or another auth service
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, validate credentials with auth service
      if (email === 'demo@example.com' && password === 'password') {
        // Mock successful login
        const mockUser: User = {
          uid: 'mock-user-id',
          email: email,
          displayName: 'Demo User',
          photoURL: null,
          emailVerified: true
        };
        
        // Store user in local storage for persistence
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
      } else {
        // Mock authentication error
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  // Mock signup function
  const signup = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    setVerificationSent(false);
    
    try {
      // In a real app, create user with auth service
      if (password.length < 6) {
        throw new Error('Password should be at least 6 characters');
      }
      
      // Mock successful signup
      setVerificationSent(true);
      // In a real app, we would send verification email here
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  // Mock Google login
  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, trigger Google OAuth flow
      
      // Mock successful Google login
      const mockUser: User = {
        uid: 'google-user-id',
        email: 'google-user@example.com',
        displayName: 'Google User',
        photoURL: 'https://lh3.googleusercontent.com/a/default-user',
        emailVerified: true
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during Google login');
    } finally {
      setLoading(false);
    }
  };

  // Mock logout function
  const logout = async () => {
    setLoading(true);
    
    try {
      // In a real app, sign out from auth service
      localStorage.removeItem('user');
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during logout');
    } finally {
      setLoading(false);
    }
  };

  // Mock resend verification email
  const resendVerificationEmail = async () => {
    setLoading(true);
    setError(null);
    setVerificationSent(false);
    
    try {
      // In a real app, trigger resend verification email
      setVerificationSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred sending verification email');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    verificationSent,
    login,
    signup,
    loginWithGoogle,
    logout,
    resendVerificationEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};