import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryConstraint,
  DocumentSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  VendorItem,
  VendorDetails,
  SearchVendorRequest,
  SearchVendorResponse,
} from '@/src/types/vendor';

// Firestore collection name
const VENDORS = 'vendors';

// Maps ERD vendor type enum → frontend category string
const TYPE_TO_CATEGORY: Record<string, string> = {
  VENUE: 'venue',
  FLORIST: 'florist',
  CATERING: 'catering',
  PHOTOGRAPHY: 'photography',
  VIDEOGRAPHY: 'videography',
  DJ: 'entertainment',
  BAND: 'entertainment',
  TRADITIONAL_MUSIC: 'entertainment',
  SOLO_MUSICIAN: 'entertainment',
  KIDS_ENTERTAINER: 'entertainment',
  DANCER_PERFORMER: 'entertainment',
  MAGICIAN_IMPERSONATOR: 'entertainment',
  BEAUTY: 'beauty',
  LUXURY_CAR: 'transportation',
  GUEST_BUS: 'transportation',
  TRAVEL_AGENCY: 'transportation',
  DECORATOR: 'decorator',
  BALLOON_DECORATOR: 'decorator',
  LIGHTING: 'decorator',
  FAIRY_LIGHT: 'decorator',
  SPECIAL_EFFECTS: 'decorator',
  FIREWORKS: 'decorator',
  PRINT_SHOP: 'stationery',
  AUDIO_GUESTBOOK: 'stationery',
  CAKE_SWEET_TABLE: 'catering',
  GUEST_GIFTS: 'gifts',
  PHOTOBOOTH: 'photography',
  PHOTOBOOTH_360: 'photography',
  BOUTONNIERES: 'florist',
  NANNY: 'childcare',
  OFFICIANT: 'ceremony',
  WEDDING_ORGANIZER: 'planning',
};

function docToVendorItem(id: string, data: Record<string, any>): VendorItem {
  return {
    id,
    name: data.businessName ?? data.name ?? '',
    category: TYPE_TO_CATEGORY[data.type] ?? data.category ?? data.type?.toLowerCase() ?? '',
    city: data.city ?? data.location ?? '',
    shortDescription: data.shortDescription ?? '',
    imageUrl: data.imageUrl ?? data.images?.[0],
    rating: data.rating ?? 0,
    capacity: data.maxCapacity ?? data.capacity,
    tags: data.tags ?? [],
  };
}

function docToVendorDetails(id: string, data: Record<string, any>): VendorDetails {
  return {
    ...docToVendorItem(id, data),
    fullDescription: data.fullDescription ?? data.shortDescription ?? '',
    images: data.images ?? (data.imageUrl ? [data.imageUrl] : []),
    address: data.address ?? data.location ?? '',
    phone: data.phone,
    email: data.email,
    website: data.website,
    socialMedia: data.socialMedia,
    priceRange: data.priceRange,
    availability: data.availability,
    features: data.features ?? data.tags ?? [],
    reviews: data.reviews ?? [],
    openingHours: data.openingHours,
  };
}

// Cursor cache for pagination (page number → last document snapshot)
const pageCursors = new Map<string, DocumentSnapshot>();

function pageCacheKey(request: SearchVendorRequest): string {
  return JSON.stringify({
    text: request.text,
    category: request.category,
    city: request.city,
    filters: request.filters,
  });
}

export async function searchVendors(
  request: SearchVendorRequest
): Promise<SearchVendorResponse> {
  const constraints: QueryConstraint[] = [
    where('enabled', '==', true),
    where('status', '==', 'APPROVED'),
  ];

  if (request.category) {
    // Match against either the stored category or the type enum
    const typeKey = Object.entries(TYPE_TO_CATEGORY).find(
      ([, cat]) => cat === request.category
    )?.[0];
    if (typeKey) {
      constraints.push(where('type', '==', typeKey));
    } else {
      constraints.push(where('category', '==', request.category));
    }
  }

  if (request.city) {
    constraints.push(where('city', '==', request.city));
  }

  if (request.filters?.capacityMin) {
    constraints.push(where('maxCapacity', '>=', parseInt(request.filters.capacityMin)));
  }

  constraints.push(orderBy('rating', 'desc'));

  const { page, size } = request.pageRequest;

  // Use cursor for pages beyond the first
  if (page > 0) {
    const cacheKey = pageCacheKey(request);
    const cursor = pageCursors.get(`${cacheKey}:${page - 1}`);
    if (cursor) {
      constraints.push(startAfter(cursor));
    }
  }

  constraints.push(limit(size + 1)); // fetch one extra to detect hasMore

  const q = query(collection(db, VENDORS), ...constraints);
  const snapshot = await getDocs(q);
  const docs = snapshot.docs;

  const hasMore = docs.length > size;
  const pageDocs = hasMore ? docs.slice(0, size) : docs;

  // Cache the last doc of this page for next-page cursor
  if (pageDocs.length > 0) {
    const cacheKey = pageCacheKey(request);
    pageCursors.set(`${cacheKey}:${page}`, pageDocs[pageDocs.length - 1]);
  }

  const vendors = pageDocs.map((d) => docToVendorItem(d.id, d.data()));

  // Client-side text filter (Firestore doesn't support full-text search natively)
  const filtered = request.text
    ? vendors.filter((v) => {
        const needle = request.text!.toLowerCase();
        return (
          v.name.toLowerCase().includes(needle) ||
          v.shortDescription.toLowerCase().includes(needle) ||
          v.city.toLowerCase().includes(needle)
        );
      })
    : vendors;

  const categories = new Set(filtered.map((v) => v.category));
  const singleCategory = categories.size === 1;

  return {
    metadata: {
      totalResults: filtered.length,
      page,
      size,
      hasMore,
      singleCategory,
      category: singleCategory ? Array.from(categories)[0] : undefined,
    },
    data: filtered,
  };
}

export async function getFeaturedVendorsByCategory(
  category: string,
  count: number = 5
): Promise<VendorItem[]> {
  const typeKeys = Object.entries(TYPE_TO_CATEGORY)
    .filter(([, cat]) => cat === category)
    .map(([type]) => type);

  if (typeKeys.length === 0) return [];

  const q = query(
    collection(db, VENDORS),
    where('enabled', '==', true),
    where('status', '==', 'APPROVED'),
    where('type', 'in', typeKeys.slice(0, 10)),
    orderBy('rating', 'desc'),
    limit(count)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => docToVendorItem(d.id, d.data()));
}

export async function getVendorDetails(vendorId: string): Promise<VendorDetails> {
  const ref = doc(db, VENDORS, vendorId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error(`Vendor ${vendorId} not found`);
  }

  return docToVendorDetails(snap.id, snap.data());
}

// Vendor self-service profile management
export interface VendorProfileData {
  businessName: string;
  type: string;
  city: string;
  shortDescription: string;
  fullDescription?: string;
  phone?: string;
  email?: string;
  website?: string;
  enabled: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rating?: number;
  imageUrl?: string;
}

export async function getVendorProfile(vendorId: string): Promise<VendorProfileData | null> {
  const snap = await getDoc(doc(db, VENDORS, vendorId));
  if (!snap.exists()) return null;
  return snap.data() as VendorProfileData;
}

export async function createVendorProfile(vendorId: string, data: Omit<VendorProfileData, 'enabled' | 'status'>): Promise<void> {
  await setDoc(doc(db, VENDORS, vendorId), {
    ...data,
    enabled: false,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  });
}

export async function updateVendorProfile(vendorId: string, data: Partial<VendorProfileData>): Promise<void> {
  await setDoc(doc(db, VENDORS, vendorId), data, { merge: true });
}

// Vendor inquiries — top-level collection for cross-wedding queries
export interface VendorInquiryRecord {
  id: string;
  vendorId: string;
  weddingId: string;
  coupleName?: string;
  message: string;
  contactedAt: string;
  status: 'PENDING' | 'REPLIED' | 'BOOKED';
}

export async function getVendorInquiries(vendorId: string): Promise<VendorInquiryRecord[]> {
  const q = query(
    collection(db, 'vendorInquiries'),
    where('vendorId', '==', vendorId),
    orderBy('contactedAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as VendorInquiryRecord));
}
