import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface UserProfile {
  name: string;
  email: string;
  role: 'CLIENT' | 'VENDOR' | 'ORGANIZER' | 'ADMIN';
  userRole?: 'BRIDE' | 'GROOM';
  weddingId?: string;
  onboardingComplete?: boolean;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', userId));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

export async function createUserProfile(userId: string, profile: UserProfile): Promise<void> {
  await setDoc(doc(db, 'users', userId), profile);
}

export async function updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
  await setDoc(doc(db, 'users', userId), data, { merge: true });
}
