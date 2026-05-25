import { SearchVendorRequest, SearchVendorResponse, VendorDetails } from '@/src/types/vendor';
import { getMockVendorSearch, getMockVendorDetails } from './mockData';
import { searchVendors, getVendorDetails } from './vendorService';

// Set EXPO_PUBLIC_USE_MOCK=true in .env to force mock data during development
const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true';

export class ApiService {
  static async searchVendors(request: SearchVendorRequest): Promise<SearchVendorResponse> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return getMockVendorSearch(request);
    }
    return searchVendors(request);
  }

  static async getVendorDetails(vendorId: string): Promise<VendorDetails> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return getMockVendorDetails(vendorId);
    }
    return getVendorDetails(vendorId);
  }
}
