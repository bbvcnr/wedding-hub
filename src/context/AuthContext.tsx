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
import { createVendorProfile } from '../services/vendorService';
import { ADMIN_EMAIL } from '../services/adminService';

export type AccountType = 'CLIENT' | 'VENDOR' | 'ADMIN';

interface AuthContextValue {
  user: User | null;
  userId: string | null;
  weddingId: string | null;
  accountType: AccountType | null;
  loading: boolean;
  onboardingComplete: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, accountType: AccountType) => Promise<void>;
  completeOnboarding: (userRole: 'BRIDE' | 'GROOM', city: string, weddingDate: string) => Promise<void>;
  completeVendorOnboarding: (businessName: string, type: string, city: string, description: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  userId: null,
  weddingId: null,
  accountType: null,
  loading: true,
  onboardingComplete: false,
  login: async () => {},
  register: async () => {},
  completeOnboarding: async () => {},
  completeVendorOnboarding: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [weddingId, setWeddingId] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        let profile = await getUserProfile(firebaseUser.uid);

        // Auto-create admin profile if email matches and no Firestore doc exists yet
        if (firebaseUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
            (!profile || profile.role !== 'ADMIN')) {
          const adminProfile = { name: 'Admin', email: ADMIN_EMAIL, role: 'ADMIN' as const, onboardingComplete: true };
          await createUserProfile(firebaseUser.uid, adminProfile);
          profile = adminProfile;
        }

        // Block banned users immediately
        if ((profile as any)?.banned === true) {
          await signOut(auth);
          setLoading(false);
          return;
        }
        const wId = profile?.weddingId ?? null;
        const role: AccountType =
          profile?.role === 'ADMIN' ? 'ADMIN' :
          profile?.role === 'VENDOR' ? 'VENDOR' : 'CLIENT';
        setWeddingId(wId);
        setAccountType(role);
        setOnboardingComplete(
          role === 'ADMIN' ? true :
          profile?.onboardingComplete ?? (role === 'CLIENT' ? wId != null : false)
        );
      } else {
        setWeddingId(null);
        setAccountType(null);
        setOnboardingComplete(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    let profile = await getUserProfile(cred.user.uid);

    // Auto-create admin profile if email matches
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
        (!profile || profile.role !== 'ADMIN')) {
      const adminProfile = { name: 'Admin', email: ADMIN_EMAIL, role: 'ADMIN' as const, onboardingComplete: true };
      await createUserProfile(cred.user.uid, adminProfile);
      profile = adminProfile;
    }

    if ((profile as any)?.banned === true) {
      await signOut(auth);
      throw new Error('Your account has been suspended.');
    }
    const wId = profile?.weddingId ?? null;
    const role: AccountType =
      profile?.role === 'ADMIN' ? 'ADMIN' :
      profile?.role === 'VENDOR' ? 'VENDOR' : 'CLIENT';
    setWeddingId(wId);
    setAccountType(role);
    setOnboardingComplete(
      role === 'ADMIN' ? true :
      profile?.onboardingComplete ?? (role === 'CLIENT' ? wId != null : false)
    );
  };

  const register = async (email: string, password: string, name: string, type: AccountType) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    if (type === 'CLIENT') {
      const weddingRef = doc(collection(db, 'weddings'));
      await updateWedding(weddingRef.id, { coupleName: name, createdAt: new Date().toISOString() });
      await createUserProfile(uid, { name, email, role: 'CLIENT', weddingId: weddingRef.id, onboardingComplete: false });
      setWeddingId(weddingRef.id);
    } else {
      await createVendorProfile(uid, { businessName: name, type: '', city: '', shortDescription: '' });
      await createUserProfile(uid, { name, email, role: 'VENDOR', vendorId: uid, onboardingComplete: false });
    }
    setAccountType(type);
    setOnboardingComplete(false);
  };

  const completeOnboarding = async (userRole: 'BRIDE' | 'GROOM', city: string, weddingDate: string) => {
    if (!user || !weddingId) return;
    await updateUserProfile(user.uid, { userRole, onboardingComplete: true });
    await updateWedding(weddingId, { city: city.trim() || undefined, weddingDate: weddingDate.trim() || undefined });
    setOnboardingComplete(true);
  };

  const completeVendorOnboarding = async (
    businessName: string, type: string, city: string, description: string, phone: string
  ) => {
    if (!user) return;
    await updateUserProfile(user.uid, { name: businessName, onboardingComplete: true });
    await createVendorProfile(user.uid, { businessName, type, city, shortDescription: description, phone });
    setOnboardingComplete(true);
  };

  const logout = async () => {
    await signOut(auth);
    setWeddingId(null);
    setAccountType(null);
    setOnboardingComplete(false);
  };

  return (
    <AuthContext.Provider value={{
      user, userId: user?.uid ?? null, weddingId, accountType, loading,
      onboardingComplete, login, register, completeOnboarding, completeVendorOnboarding, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
