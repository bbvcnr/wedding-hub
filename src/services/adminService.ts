import {
  collection, getDocs, doc, setDoc, deleteDoc,
  query, orderBy, where, getDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile } from './userService';
import { VendorProfileData } from './vendorService';

// ── Admin credentials (create this Firebase Auth account once via Firebase Console)
// Email: admin@elenn.app  |  Password: set in Firebase Console
export const ADMIN_EMAIL = 'admin@elenn.app';

export interface AdminUserRecord {
  uid: string;
  profile: UserProfile & { banned?: boolean; createdAt?: string };
}

export interface AdminVendorRecord {
  id: string;
  data: VendorProfileData & { createdAt?: string };
}

// ─── Users ───────────────────────────────────────────────
export async function getAllUsers(): Promise<AdminUserRecord[]> {
  const snap = await getDocs(query(collection(db, 'users'), orderBy('role', 'asc')));
  return snap.docs.map((d) => ({ uid: d.id, profile: d.data() as AdminUserRecord['profile'] }));
}

export async function banUser(uid: string): Promise<void> {
  await setDoc(doc(db, 'users', uid), { banned: true, bannedAt: new Date().toISOString() }, { merge: true });
}

export async function unbanUser(uid: string): Promise<void> {
  await setDoc(doc(db, 'users', uid), { banned: false, bannedAt: null }, { merge: true });
}

export async function deleteUserRecord(uid: string): Promise<void> {
  await deleteDoc(doc(db, 'users', uid));
}

// ─── Vendors ─────────────────────────────────────────────
export async function getAllVendors(): Promise<AdminVendorRecord[]> {
  const snap = await getDocs(query(collection(db, 'vendors'), orderBy('status', 'asc')));
  return snap.docs.map((d) => ({ id: d.id, data: d.data() as AdminVendorRecord['data'] }));
}

export async function approveVendor(vendorId: string): Promise<void> {
  await setDoc(doc(db, 'vendors', vendorId), { status: 'APPROVED', enabled: true }, { merge: true });
}

export async function rejectVendor(vendorId: string): Promise<void> {
  await setDoc(doc(db, 'vendors', vendorId), { status: 'REJECTED', enabled: false }, { merge: true });
}

export async function deleteVendorRecord(vendorId: string): Promise<void> {
  await deleteDoc(doc(db, 'vendors', vendorId));
}

// ─── Stats ────────────────────────────────────────────────
export async function getAdminStats(): Promise<{
  totalUsers: number; totalVendors: number;
  pendingVendors: number; bannedUsers: number;
}> {
  const [usersSnap, vendorsSnap, pendingSnap] = await Promise.all([
    getDocs(collection(db, 'users')),
    getDocs(collection(db, 'vendors')),
    getDocs(query(collection(db, 'vendors'), where('status', '==', 'PENDING'))),
  ]);
  const banned = usersSnap.docs.filter((d) => d.data().banned === true).length;
  return {
    totalUsers: usersSnap.size,
    totalVendors: vendorsSnap.size,
    pendingVendors: pendingSnap.size,
    bannedUsers: banned,
  };
}
