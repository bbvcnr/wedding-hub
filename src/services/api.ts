import { SearchVendorRequest, SearchVendorResponse, VendorDetails } from '@/src/types/vendor';
import { getMockVendorSearch, getMockVendorDetails } from './mockData';

// Base API URL - Update this with your actual API endpoint
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com';

// Use mock data if API URL is the placeholder
const USE_MOCK_DATA = !process.env.EXPO_PUBLIC_API_URL || API_BASE_URL === 'https://api.example.com';

/**
 * API service for vendor search
 */
export class ApiService {
  private static baseUrl = API_BASE_URL;

  /**
   * Search vendors with filters and pagination
   */
  static async searchVendors(
    request: SearchVendorRequest
  ): Promise<SearchVendorResponse> {
    // Use mock data if API is not configured
    if (USE_MOCK_DATA) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return getMockVendorSearch(request);
    }

    try {
      const response = await fetch(`${this.baseUrl}/vendor/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data: SearchVendorResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching vendors:', error);
      throw error;
    }
  }

  /**
   * Get detailed vendor information by ID
   */
  static async getVendorDetails(vendorId: string): Promise<VendorDetails> {
    // Use mock data if API is not configured
    if (USE_MOCK_DATA) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      return getMockVendorDetails(vendorId);
    }

    try {
      const response = await fetch(`${this.baseUrl}/vendor/${vendorId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data: VendorDetails = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching vendor details:', error);
      throw error;
    }
  }
}

