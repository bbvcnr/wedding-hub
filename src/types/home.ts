import { VendorItem } from '@/src/types/vendor';

export interface HomeCategory {
  id: string;
  label: string;
  icon: string;
  imageUrl?: string;
}

export interface HireService {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
}

export interface HomeTip {
  id: string;
  title: string;
  description: string;
  accent: 'pink' | 'blue' | 'green';
}

export interface QuickAction {
  id: string;
  label: string;
  route: string;
  color: 'pink' | 'blue' | 'green' | 'neutral';
  icon: string;
}

export interface HomeContent {
  coupleName?: string;
  weddingDate?: string;
  hasWedding: boolean;
  categories: HomeCategory[];
  hireServices: HireService[];
  featuredVendors: VendorItem[];
  featuredPhotographers: VendorItem[];
  recentlyLikedVendors: VendorItem[];
  tips: HomeTip[];
  quickActions: QuickAction[];
}
