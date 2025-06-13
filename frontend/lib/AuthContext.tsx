"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
  AuthError,
} from "firebase/auth";
import { auth } from "./firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  verificationSent: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);

  const clearError = () => setError(null);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      clearError();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        await signOut(auth);
        setError(
          "Please verify your email address before logging in. Check your inbox for a verification link."
        );
        throw new Error("Email not verified");
      }
    } catch (err) {
      const authError = err as AuthError;
      if ((err as Error).message === "Email not verified") {
        setError(
          "Please verify your email address before logging in. Check your inbox for a verification link."
        );
      } else {
        setError(getErrorMessage(authError));
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      clearError();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await sendEmailVerification(userCredential.user);
      setVerificationSent(true);

      await signOut(auth);
    } catch (err) {
      const authError = err as AuthError;
      setError(getErrorMessage(authError));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      clearError();
      await signOut(auth);
    } catch (err) {
      const authError = err as AuthError;
      setError(getErrorMessage(authError));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      setLoading(true);
      clearError();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      const authError = err as AuthError;
      setError(getErrorMessage(authError));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async (): Promise<void> => {
    if (!user) {
      setError("No user found to send verification email to");
      return;
    }

    try {
      setLoading(true);
      clearError();
      await sendEmailVerification(user);
      setVerificationSent(true);
    } catch (err) {
      const authError = err as AuthError;
      setError(getErrorMessage(authError));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (error: AuthError): string => {
    switch (error.code) {
      case "auth/user-not-found":
        return "No account found with this email address";
      case "auth/invalid-email":
        return "Please enter a valid email address";
      case "auth/wrong-password":
        return "Incorrect password. Please try again";
      case "auth/invalid-credential":
        return "Invalid email or password. Please check your credentials";
      case "auth/user-disabled":
        return "This account has been disabled";
      case "auth/email-already-in-use":
        return "An account with this email already exists";
      case "auth/weak-password":
        return "Password must be at least 6 characters long";
      case "auth/too-many-requests":
        return "Too many failed login attempts. Please try again later";
      case "auth/network-request-failed":
        return "Network error. Please check your internet connection";
      case "auth/popup-blocked":
        return "Popup was blocked. Please allow popups for this site";
      case "auth/popup-closed-by-user":
        return "Sign-in was cancelled";
      case "auth/requires-recent-login":
        return "Please log out and log back in to continue";
      case "auth/email-not-verified":
        return "Please verify your email before signing in";
      default:
        return error.message || "An error occurred during authentication";
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    error,
    verificationSent,
    login,
    signup,
    logout,
    loginWithGoogle,
    resendVerificationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
