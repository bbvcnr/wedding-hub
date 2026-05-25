// Request Payload
export interface SearchVendorRequest {
  text?: string; // Search query
  category?: string; // e.g., "venue"
  city?: string;
  filters?: Record<string, string>; // e.g., { capacityMin: "100" }
  pageRequest: {
    page: number;
    size: number;
  };
}

// Response Payload
export interface SearchVendorResponse {
  metadata: {
    totalResults: number;
    page: number;
    size: number;
    hasMore: boolean;
    singleCategory: boolean;
    category?: string;
  };
  data: VendorItem[];
}

// The Item displayed in the card
export interface VendorItem {
  id: string;
  name: string;
  category: string;
  city: string;
  shortDescription: string;
  imageUrl?: string;
  rating?: number; // Derived from UI stars
  // Additional fields based on filters (capacity, etc.)
  capacity?: number; // e.g., 350
  tags?: string[]; // e.g., ["Puno Mjesta"]
}

// Detailed vendor information
export interface VendorDetails extends VendorItem {
  fullDescription: string;
  images: string[];
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  priceRange?: string; // e.g., "$$" or "$100-$500"
  availability?: string[];
  features?: string[];
  reviews?: VendorReview[];
  openingHours?: {
    [key: string]: string; // e.g., { "Monday": "9:00 - 17:00" }
  };
}

export interface VendorReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
}

