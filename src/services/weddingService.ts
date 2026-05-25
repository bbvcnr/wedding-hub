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
import { Wedding, VendorLike } from '@/src/types/profile';

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
