import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { doc, collection } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { getUserProfile, createUserProfile, updateUserProfile } from '../services/userService';
import { updateWedding } from '../services/weddingService';

interface AuthContextValue {
  user: User | null;
  userId: string | null;
  weddingId: string | null;
  loading: boolean;
  onboardingComplete: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, coupleName: string) => Promise<void>;
  completeOnboarding: (userRole: 'BRIDE' | 'GROOM', city: string, weddingDate: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  userId: null,
  weddingId: null,
  loading: true,
  onboardingComplete: false,
  login: async () => {},
  register: async () => {},
  completeOnboarding: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [weddingId, setWeddingId] = useState<string | null>(null);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        const wId = profile?.weddingId ?? null;
        setWeddingId(wId);
        // Treat as complete if flag is set, OR if they already have a wedding (pre-onboarding account)
        setOnboardingComplete(profile?.onboardingComplete ?? (wId != null));
      } else {
        setWeddingId(null);
        setOnboardingComplete(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const profile = await getUserProfile(cred.user.uid);
    const wId = profile?.weddingId ?? null;
    setWeddingId(wId);
    setOnboardingComplete(profile?.onboardingComplete ?? (wId != null));
  };

  const register = async (email: string, password: string, coupleName: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const weddingRef = doc(collection(db, 'weddings'));
    await updateWedding(weddingRef.id, {
      coupleName,
      createdAt: new Date().toISOString(),
    });
    await createUserProfile(cred.user.uid, {
      name: coupleName,
      email,
      role: 'CLIENT',
      weddingId: weddingRef.id,
      onboardingComplete: false,
    });
    setWeddingId(weddingRef.id);
    setOnboardingComplete(false);
  };

  const completeOnboarding = async (userRole: 'BRIDE' | 'GROOM', city: string, weddingDate: string) => {
    if (!user || !weddingId) return;
    await updateUserProfile(user.uid, { userRole, onboardingComplete: true });
    await updateWedding(weddingId, {
      city: city.trim() || undefined,
      weddingDate: weddingDate.trim() || undefined,
    });
    setOnboardingComplete(true);
  };

  const logout = async () => {
    await signOut(auth);
    setWeddingId(null);
    setOnboardingComplete(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userId: user?.uid ?? null,
        weddingId,
        loading,
        onboardingComplete,
        login,
        register,
        completeOnboarding,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
