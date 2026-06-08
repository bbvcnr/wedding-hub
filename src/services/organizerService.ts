import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  arrayUnion,
} from 'firebase/firestore';
import { db } from './firebase';
import { getWedding } from './weddingService';
import { UserProfile } from './userService';
import { Wedding } from '@/src/types/profile';

export type OrganizerInviteStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';

export interface OrganizerInvite {
  id: string;
  weddingId: string;
  organizerEmail: string;
  organizerEmailLower: string;
  invitedByUserId: string;
  invitedByEmail?: string;
  status: OrganizerInviteStatus;
  createdAt: string;
  respondedAt?: string;
  organizerUserId?: string;
}

export async function getUserByEmail(email: string): Promise<(UserProfile & { id: string }) | null> {
  const normalized = email.trim().toLowerCase();
  const q = query(collection(db, 'users'), where('emailLower', '==', normalized));
  const snap = await getDocs(q);

  if (!snap.empty) {
    const d = snap.docs[0];
    return { id: d.id, ...(d.data() as UserProfile) };
  }

  const fallback = query(collection(db, 'users'), where('email', '==', email.trim()));
  const fallbackSnap = await getDocs(fallback);
  if (fallbackSnap.empty) return null;
  const f = fallbackSnap.docs[0];
  return { id: f.id, ...(f.data() as UserProfile) };
}

export async function createOrganizerInvite(params: {
  weddingId: string;
  organizerEmail: string;
  invitedByUserId: string;
  invitedByEmail?: string;
}): Promise<string> {
  const normalizedEmail = params.organizerEmail.trim().toLowerCase();
  if (!normalizedEmail) throw new Error('Organizer email is required.');

  const organizer = await getUserByEmail(normalizedEmail);
  if (!organizer) throw new Error('No account found for this email.');
  if (organizer.role !== 'ORGANIZER') throw new Error('This user is not registered as an organizer.');

  const existing = await getOrganizerInvitesByWedding(params.weddingId);
  const alreadyPending = existing.some(
    (inv) => inv.organizerEmailLower === normalizedEmail && inv.status === 'PENDING'
  );
  if (alreadyPending) throw new Error('A pending invite already exists for this organizer.');

  const ref = await addDoc(collection(db, 'organizerInvites'), {
    weddingId: params.weddingId,
    organizerEmail: organizer.email,
    organizerEmailLower: normalizedEmail,
    invitedByUserId: params.invitedByUserId,
    invitedByEmail: params.invitedByEmail ?? '',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  });

  return ref.id;
}

export async function getOrganizerInvitesByWedding(weddingId: string): Promise<OrganizerInvite[]> {
  const q = query(collection(db, 'organizerInvites'), where('weddingId', '==', weddingId));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<OrganizerInvite, 'id'>) }))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getPendingOrganizerInvitesByEmail(email: string): Promise<OrganizerInvite[]> {
  const normalizedEmail = email.trim().toLowerCase();
  const q = query(collection(db, 'organizerInvites'), where('organizerEmailLower', '==', normalizedEmail));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<OrganizerInvite, 'id'>) }))
    .filter((invite) => invite.status === 'PENDING')
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function acceptOrganizerInvite(inviteId: string, organizerUserId: string): Promise<void> {
  const inviteRef = doc(db, 'organizerInvites', inviteId);
  const inviteSnap = await getDoc(inviteRef);
  if (!inviteSnap.exists()) throw new Error('Invite not found.');

  const invite = inviteSnap.data() as OrganizerInvite;
  if (invite.status !== 'PENDING') return;

  await updateDoc(inviteRef, {
    status: 'ACCEPTED',
    respondedAt: new Date().toISOString(),
    organizerUserId,
  });

  await setDoc(
    doc(db, 'users', organizerUserId),
    {
      organizerWeddingIds: arrayUnion(invite.weddingId),
      activeWeddingId: invite.weddingId,
    },
    { merge: true }
  );

  await setDoc(
    doc(db, 'weddings', invite.weddingId),
    {
      organizerIds: arrayUnion(organizerUserId),
    },
    { merge: true }
  );
}

export async function declineOrganizerInvite(inviteId: string): Promise<void> {
  await updateDoc(doc(db, 'organizerInvites', inviteId), {
    status: 'DECLINED',
    respondedAt: new Date().toISOString(),
  });
}

export async function getOrganizerWeddings(weddingIds: string[]): Promise<Wedding[]> {
  const uniqueIds = Array.from(new Set(weddingIds)).filter(Boolean);
  const weddings = await Promise.all(uniqueIds.map((id) => getWedding(id).catch(() => null)));
  return weddings.filter(Boolean) as Wedding[];
}
