import { HomeContent } from '@/src/types/home';

export const mockHomeContent: HomeContent = {
  coupleName: 'Jane and John',
  weddingDate: '2026-06-15',
  hasWedding: true,
  categories: [
    {
      id: 'cat-1',
      label: 'Venues',
      icon: 'business',
      imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400',
    },
    {
      id: 'cat-2',
      label: 'Photography',
      icon: 'camera',
      imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400',
    },
    {
      id: 'cat-3',
      label: 'Catering',
      icon: 'restaurant',
      imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400',
    },
    {
      id: 'cat-4',
      label: 'Music',
      icon: 'musical-notes',
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    },
    {
      id: 'cat-5',
      label: 'Beauty',
      icon: 'sparkles',
      imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
    },
  ],
  hireServices: [
    {
      id: 'hire-1',
      title: 'Hire a Wedding Organizer',
      description: 'Get expert help with timelines, budgeting, and vendor coordination.',
      actionLabel: 'Find Organizers',
    }
  ],
  featuredVendors: [
    {
      id: '1',
      name: 'Dream Wedding Venue',
      category: 'venue',
      city: 'Sarajevo',
      shortDescription: 'Elegant venue with panoramic views and modern interiors.',
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
      shortDescription: 'Luxury hall with an outdoor ceremony garden.',
      imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
      rating: 4.8,
      capacity: 250,
      tags: ['Garden', 'WiFi', 'Parking'],
    },
  ],
  recentlyLikedVendors: [
    {
      id: '3',
      name: 'Elegant Photography Studio',
      category: 'photography',
      city: 'Banja Luka',
      shortDescription: 'Award-winning photography for weddings and portraits.',
      imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
      rating: 4.7,
      tags: ['Drone', 'Video'],
    },
    {
      id: '4',
      name: 'Sweet Dreams Catering',
      category: 'catering',
      city: 'Sarajevo',
      shortDescription: 'Gourmet menus with modern and traditional cuisine.',
      imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
      rating: 4.6,
      capacity: 500,
      tags: ['Halal', 'Vegan'],
    },
  ],
  tips: [
    {
      id: 'tip-1',
      title: 'Budget first, then book',
      description: 'Decide your budget early to guide venue and vendor choices.',
    },
    {
      id: 'tip-2',
      title: 'Think about guest experience',
      description: 'Prioritize comfort: seating, food, and music flow matter most.',
    },
  ],
  quickActions: [
    { id: 'qa-2', label: 'Explore Vendors', route: '/(tabs)/search', color: 'pink', icon: 'search' },
    { id: 'qa-3', label: 'View Favorites', route: '/(tabs)/saved', color: 'neutral', icon: 'heart' },
  ],
};
