import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from './firebase';
import { Wedding, VendorLike, VendorShortlist, ChecklistItem } from '@/src/types/profile';
import { updateDoc } from 'firebase/firestore';

export async function getWedding(weddingId: string): Promise<Wedding | null> {
  const snap = await getDoc(doc(db, 'weddings', weddingId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Wedding;
}

export async function updateWedding(weddingId: string, data: Partial<Wedding>): Promise<void> {
  await setDoc(doc(db, 'weddings', weddingId), data, { merge: true });
}

export async function getFavorites(weddingId: string, count?: number): Promise<VendorLike[]> {
  const constraints = [orderBy('likedAt', 'desc'), ...(count ? [limit(count)] : [])];
  const q = query(collection(db, 'weddings', weddingId, 'favorites'), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, weddingId, ...d.data() } as VendorLike));
}

export async function addFavorite(weddingId: string, vendorId: string): Promise<string> {
  const ref = await addDoc(collection(db, 'weddings', weddingId, 'favorites'), {
    vendorId,
    likedAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function removeFavorite(weddingId: string, favoriteId: string): Promise<void> {
  await deleteDoc(doc(db, 'weddings', weddingId, 'favorites', favoriteId));
}

export async function getFavoriteByVendor(weddingId: string, vendorId: string): Promise<VendorLike | null> {
  const q = query(collection(db, 'weddings', weddingId, 'favorites'));
  const snap = await getDocs(q);
  const match = snap.docs.find((d) => d.data().vendorId === vendorId);
  if (!match) return null;
  return { id: match.id, weddingId, ...match.data() } as VendorLike;
}

export async function addInquiry(
  weddingId: string,
  vendorId: string,
  message: string
): Promise<string> {
  const ref = await addDoc(collection(db, 'weddings', weddingId, 'inquiries'), {
    vendorId,
    message,
    contactedAt: new Date().toISOString(),
    status: 'PENDING',
  });
  return ref.id;
}

export async function getShortlist(weddingId: string): Promise<VendorShortlist[]> {
  const q = query(collection(db, 'weddings', weddingId, 'shortlist'), orderBy('shortlistedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, weddingId, ...d.data() } as VendorShortlist));
}

export async function addToShortlist(weddingId: string, vendorId: string): Promise<string> {
  const ref = await addDoc(collection(db, 'weddings', weddingId, 'shortlist'), {
    vendorId,
    shortlistedAt: new Date().toISOString(),
    priority: 'MEDIUM',
  });
  return ref.id;
}

export async function removeFromShortlist(weddingId: string, shortlistId: string): Promise<void> {
  await deleteDoc(doc(db, 'weddings', weddingId, 'shortlist', shortlistId));
}

export async function getShortlistByVendor(weddingId: string, vendorId: string): Promise<VendorShortlist | null> {
  const snap = await getDocs(collection(db, 'weddings', weddingId, 'shortlist'));
  const match = snap.docs.find((d) => d.data().vendorId === vendorId);
  if (!match) return null;
  return { id: match.id, weddingId, ...match.data() } as VendorShortlist;
}

export async function joinWedding(userId: string, weddingCode: string): Promise<void> {
  const weddingSnap = await getDoc(doc(db, 'weddings', weddingCode));
  if (!weddingSnap.exists()) throw new Error('Wedding not found. Check the code and try again.');
  await setDoc(doc(db, 'users', userId), { weddingId: weddingCode }, { merge: true });
}

// Checklist
export async function getChecklist(weddingId: string): Promise<ChecklistItem[]> {
  const q = query(collection(db, 'weddings', weddingId, 'checklist'), orderBy('createdAt', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ChecklistItem));
}

export async function addChecklistItem(weddingId: string, text: string): Promise<ChecklistItem> {
  const item = { text, done: false, createdAt: new Date().toISOString() };
  const ref = await addDoc(collection(db, 'weddings', weddingId, 'checklist'), item);
  return { id: ref.id, ...item };
}

export async function toggleChecklistItem(weddingId: string, itemId: string, done: boolean): Promise<void> {
  await updateDoc(doc(db, 'weddings', weddingId, 'checklist', itemId), { done });
}

export async function deleteChecklistItem(weddingId: string, itemId: string): Promise<void> {
  await deleteDoc(doc(db, 'weddings', weddingId, 'checklist', itemId));
}
