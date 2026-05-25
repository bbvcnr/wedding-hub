import { VendorItem } from '@/src/types/vendor';
import { VendorInquiry, VendorLike, VendorShortlist, Wedding } from '@/src/types/profile';

export const mockWedding: Wedding = {
  id: 'wedding-1',
  coupleName: 'Jane and John',
  weddingDate: '2026-08-14',
  city: 'Sarajevo',
  style: 'MODERN',
  guestCountRange: { min: 120, max: 160 },
  budgetRange: { min: 12000, max: 20000, currency: 'EUR' },
  createdAt: '2025-10-01',
};

export const mockVendorLikes: VendorLike[] = [
  { id: 'like-1', weddingId: 'wedding-1', vendorId: '1', likedAt: '2025-12-10' },
  { id: 'like-2', weddingId: 'wedding-1', vendorId: '2', likedAt: '2025-12-11' },
  { id: 'like-3', weddingId: 'wedding-1', vendorId: '3', likedAt: '2025-12-12' },
  { id: 'like-4', weddingId: 'wedding-1', vendorId: '4', likedAt: '2025-12-14' },
];

export const mockVendorInquiries: VendorInquiry[] = [
  { id: 'inq-1', weddingId: 'wedding-1', vendorId: '2', contactedAt: '2025-12-20', status: 'REPLIED' },
  { id: 'inq-2', weddingId: 'wedding-1', vendorId: '5', contactedAt: '2025-12-22', status: 'PENDING' },
];

export const mockVendorShortlist: VendorShortlist[] = [
  { id: 'short-1', weddingId: 'wedding-1', vendorId: '1', shortlistedAt: '2025-12-18', priority: 'HIGH' },
  { id: 'short-2', weddingId: 'wedding-1', vendorId: '4', shortlistedAt: '2025-12-19', priority: 'MEDIUM' },
];

export const mockRecentlyLikedVendors: VendorItem[] = [
  {
    id: '1',
    name: 'Dream Wedding Venue',
    category: 'venue',
    city: 'Sarajevo',
    shortDescription: 'Elegantno mjesto sa panoramskim pogledom i modernim interijerom.',
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
    rating: 4.6,
    capacity: 350,
    tags: ['Parking', 'AC', 'Panorama'],
  },
  {
    id: '2',
    name: 'Royal Garden Hall',
    category: 'venue',
    city: 'Mostar',
    shortDescription: 'Luksuzna dvorana sa vrtom za ceremoniju na otvorenom.',
    imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
    rating: 4.8,
    capacity: 250,
    tags: ['Vrt', 'WiFi', 'Parking'],
  },
  {
    id: '3',
    name: 'Elegant Photography Studio',
    category: 'photography',
    city: 'Banja Luka',
    shortDescription: 'Profesionalni fotograf za vjenčanja i portrete.',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    rating: 4.7,
    tags: ['Drone', 'Video'],
  },
];
