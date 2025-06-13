
import { useState, useEffect } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  sendEmailVerification
} from 'firebase/auth';
import { auth } from './firebase';
import { GoogleAuthProvider } from 'firebase/auth';

const googleProvider = new GoogleAuthProvider();

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email: string, password: string) => {
    setError(null);
    setVerificationSent(false);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await sendEmailVerification(userCredential.user);
      setVerificationSent(true);
      setUser(userCredential.user);
      return userCredential.user;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      
      if (!userCredential.user.emailVerified) {
        setError("Please verify your email before signing in.");
        await signOut(auth);
        throw new Error("Email not verified");
      }
      
      setUser(userCredential.user);
      return userCredential.user;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    setError(null);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      
      setUser(userCredential.user);
      return userCredential.user;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
      setUser(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const resendVerificationEmail = async () => {
    setError(null);
    setVerificationSent(false);
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setVerificationSent(true);
      } else {
        throw new Error("No user is currently signed in");
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    verificationSent,
    signup,
    login,
    loginWithGoogle,
    logout,
    resendVerificationEmail
  };
}