export interface Wedding {
  id: string;

  // Identity
  coupleName: string; // "Ena & Amir"
  weddingDate?: string; // ISO, optional if not set yet
  city?: string;

  // Preferences (for recommendations)
  style?: WeddingStyle;
  guestCountRange?: {
    min: number;
    max: number;
  };
  budgetRange?: BudgetRange;

  // Progress (derived or stored)
  createdAt: string;
  partnerEmail?: string;

  // Guests & seating
  totalGuests?: number;
  numberOfTables?: number;
  vipTables?: number;

  // Budget tracking
  totalBudget?: number;
  spentBudget?: number;
  budgetCurrency?: 'EUR' | 'USD' | 'BAM';

  // Booked venue
  bookedVenueId?: string;
  bookedVenueName?: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
  createdAt: string;
}

export type WeddingStyle =
  | "MODERN"
  | "RUSTIC"
  | "LUXURY"
  | "TRADITIONAL"
  | "BOHO";

export interface BudgetRange {
  min?: number;
  max?: number;
  currency: "EUR" | "USD" | "BAM";
}

export interface WeddingUser {
  id: string;
  fullName: string;
  email: string;
  role: "PRIMARY" | "PARTNER";
}

export interface VendorLike {
  id: string;
  weddingId: string;
  vendorId: string;
  likedAt: string;
}

export interface VendorInquiry {
  id: string;
  weddingId: string;
  vendorId: string;
  contactedAt: string;
  status?: 'PENDING' | 'REPLIED' | 'BOOKED';
}

export interface VendorShortlist {
  id: string;
  weddingId: string;
  vendorId: string;
  shortlistedAt: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
}


