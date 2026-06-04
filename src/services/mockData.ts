import { VendorItem, SearchVendorRequest, SearchVendorResponse, VendorDetails } from '@/src/types/vendor';

// Mock vendor data
const MOCK_VENDORS: VendorItem[] = [
  {
    id: '1',
    name: 'Dream Wedding Venue',
    category: 'venue',
    city: 'Sarajevo',
    shortDescription: 'Elegantno mjesto za vaš savršen dan. Prekrasan pogled na grad sa modernim interijerom i profesionalnim osobljem.',
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
    rating: 4.5,
    capacity: 350,
    tags: ['Puno Mjesta', 'Parking', 'AC'],
  },
  {
    id: '2',
    name: 'Royal Garden Hall',
    category: 'venue',
    city: 'Mostar',
    shortDescription: 'Luksuzna dvorana sa vrtom za vanjsku ceremoniju. Idealno za ljetne vjenčanja sa do 250 gostiju.',
    imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
    rating: 4.8,
    capacity: 250,
    tags: ['Vrt', 'Parking', 'WiFi'],
  },
  {
    id: '3',
    name: 'Elegant Photography Studio',
    category: 'photography',
    city: 'Banja Luka',
    shortDescription: 'Profesionalni fotograf sa 10+ godina iskustva. Specijaliziran za vjenčanja i portrete.',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    rating: 4.7,
    capacity: undefined,
    tags: ['Drone Snimanje', 'Video'],
  },
  {
    id: '4',
    name: 'Sweet Dreams Catering',
    category: 'catering',
    city: 'Sarajevo',
    shortDescription: 'Gurmanska hrana za vaše posebno vrijeme. Tradicionalna i moderna kuhinja sa domaćim sastojcima.',
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
    rating: 4.6,
    capacity: 500,
    tags: ['Vegansko', 'Halal', 'Kosher'],
  },
  {
    id: '5',
    name: 'Classic Floral Design',
    category: 'florist',
    city: 'Tuzla',
    shortDescription: 'Kreativni aranžmani cvijeća za svaki događaj. Svježe cvijeće dostupno cijele godine.',
    imageUrl: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800',
    rating: 4.4,
    capacity: undefined,
    tags: ['Organsko', 'Dostava'],
  },
  {
    id: '6',
    name: 'Harmony Music Band',
    category: 'entertainment',
    city: 'Zenica',
    shortDescription: 'Živa muzika za nezaboravnu atmosferu. Repertoar od klasične do moderne muzike.',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    rating: 4.9,
    capacity: undefined,
    tags: ['DJ', 'Karaoke', 'Svjetlo'],
  },
  {
    id: '7',
    name: 'Bridal Beauty Salon',
    category: 'beauty',
    city: 'Sarajevo',
    shortDescription: 'Profesionalna šminka i frizura za mladenke. Iskustvo u radu sa različitim tipovima kose i kože.',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
    rating: 4.5,
    capacity: undefined,
    tags: ['Probni Termin', 'Domaća Posjeta'],
  },
  {
    id: '8',
    name: 'Grand Ballroom',
    category: 'venue',
    city: 'Banja Luka',
    shortDescription: 'Velika dvorana sa visokim stropovima i kristalnim lusterima. Kapacitet do 400 gostiju.',
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
    rating: 4.3,
    capacity: 400,
    tags: ['Parking', 'AC', 'Bina'],
  },
  {
    id: '9',
    name: 'Cake Art Studio',
    category: 'catering',
    city: 'Mostar',
    shortDescription: 'Umjetnički dizajnirani kolači i torte. Personalizovani ukusi i dekoracije po vašoj želji.',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
    rating: 4.8,
    capacity: undefined,
    tags: ['Bez Glutena', 'Vegansko', 'Dostava'],
  },
  {
    id: '10',
    name: 'Luxury Limousine Service',
    category: 'transportation',
    city: 'Sarajevo',
    shortDescription: 'Luksuzni vozni park za vaš poseban dan. Profesionalni vozači i elegantna vozila.',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800',
    rating: 4.6,
    capacity: undefined,
    tags: ['Aerodrom', '24/7', 'Osiguranje'],
  },
  {
    id: '11',
    name: 'Riverside Venue',
    category: 'venue',
    city: 'Mostar',
    shortDescription: 'Romantično mjesto pored rijeke sa prekrasnim pogledom. Idealno za vanjska vjenčanja.',
    imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
    rating: 4.7,
    capacity: 200,
    tags: ['Vanjski Prostor', 'Parking', 'WiFi'],
  },
  {
    id: '12',
    name: 'Vintage Photo Booth',
    category: 'photography',
    city: 'Banja Luka',
    shortDescription: 'Zabavni foto booth sa rekvizitima za nezaboravne uspomene. Instant print i digitalne kopije.',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    rating: 4.4,
    capacity: undefined,
    tags: ['Rekviziti', 'Instant Print', 'Digitalno'],
  },
  {
    id: '13',
    name: 'Gourmet Catering Co.',
    category: 'catering',
    city: 'Tuzla',
    shortDescription: 'Fine dining iskustvo za vaše goste. Internacionalna kuhinja sa lokalnim twistom.',
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
    rating: 4.9,
    capacity: 300,
    tags: ['Gurmansko', 'Organsko', 'Vegansko'],
  },
  {
    id: '14',
    name: 'Garden Party Venue',
    category: 'venue',
    city: 'Zenica',
    shortDescription: 'Prekrasan vrt sa šatorom za vanjska vjenčanja. Prirodna atmosfera i do 150 gostiju.',
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
    rating: 4.2,
    capacity: 150,
    tags: ['Vrt', 'Šator', 'Parking'],
  },
  {
    id: '15',
    name: 'Elite Wedding Planner',
    category: 'planning',
    city: 'Sarajevo',
    shortDescription: 'Kompletno planiranje vašeg vjenčanja od A do Ž. Iskustvo u organizaciji luksuznih događaja.',
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
    rating: 4.8,
    capacity: undefined,
    tags: ['Full Service', 'Koordinacija', '24/7 Podrška'],
  },
];

/**
 * Filter vendors based on search criteria
 */
function filterVendors(
  vendors: VendorItem[],
  request: SearchVendorRequest
): VendorItem[] {
  let filtered = [...vendors];

  // Filter by text search (name, description, city)
  if (request.text) {
    const searchText = request.text.toLowerCase();
    filtered = filtered.filter(
      (vendor) =>
        vendor.name.toLowerCase().includes(searchText) ||
        vendor.shortDescription.toLowerCase().includes(searchText) ||
        vendor.city.toLowerCase().includes(searchText)
    );
  }

  // Filter by category
  if (request.category) {
    filtered = filtered.filter((vendor) => vendor.category === request.category);
  }

  // Filter by city
  if (request.city) {
    const cityLower = request.city.toLowerCase();
    filtered = filtered.filter((vendor) =>
      vendor.city.toLowerCase().includes(cityLower)
    );
  }

  // Filter by capacity if specified
  if (request.filters?.capacityMin) {
    const minCapacity = parseInt(request.filters.capacityMin);
    filtered = filtered.filter(
      (vendor) => vendor.capacity && vendor.capacity >= minCapacity
    );
  }

  if (request.filters?.capacityMax) {
    const maxCapacity = parseInt(request.filters.capacityMax);
    filtered = filtered.filter(
      (vendor) => !vendor.capacity || vendor.capacity <= maxCapacity
    );
  }

  return filtered;
}

/**
 * Get mock vendor search results with pagination
 */
export function getMockFeaturedByCategory(category: string, count: number): VendorItem[] {
  return MOCK_VENDORS.filter((v) => v.category === category).slice(0, count);
}

export function getMockVendorSearch(
  request: SearchVendorRequest
): SearchVendorResponse {
  // Filter vendors
  const filtered = filterVendors(MOCK_VENDORS, request);

  // Pagination
  const page = request.pageRequest.page;
  const size = request.pageRequest.size;
  const startIndex = page * size;
  const endIndex = startIndex + size;
  const paginatedData = filtered.slice(startIndex, endIndex);
  const hasMore = endIndex < filtered.length;

  // Determine category
  const categories = new Set(filtered.map((v) => v.category));
  const singleCategory = categories.size === 1;
  const category = singleCategory ? Array.from(categories)[0] : undefined;

  return {
    metadata: {
      totalResults: filtered.length,
      page,
      size,
      hasMore,
      singleCategory,
      category,
    },
    data: paginatedData,
  };
}

/**
 * Get detailed vendor information by ID
 */
export function getMockVendorDetails(vendorId: string): VendorDetails {
  const vendor = MOCK_VENDORS.find((v) => v.id === vendorId);
  
  if (!vendor) {
    throw new Error(`Vendor with ID ${vendorId} not found`);
  }

  // Generate mock detailed data based on vendor
  const detailsMap: Record<string, Partial<VendorDetails>> = {
    '1': {
      fullDescription: 'Dream Wedding Venue je vaš savršeni izbor za najvažniji dan u životu. Smješteni u srcu Sarajeva, nudimo elegantnu dvoranu sa kapacitetom do 350 gostiju. Naš moderni interijer i profesionalno osoblje će osigurati da vaš dan bude nezaboravan. Dvorana je opremljena najnovijom audio i svjetlosnom opremom, a naš panoramski pogled na grad stvara savršenu atmosferu za vaš poseban dan.',
      images: [
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
        'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
      ],
      address: 'Ferhadija 12, Sarajevo 71000',
      phone: '+387 33 123 456',
      email: 'info@dreamwedding.ba',
      website: 'www.dreamwedding.ba',
      socialMedia: {
        facebook: 'facebook.com/dreamwedding',
        instagram: 'instagram.com/dreamwedding',
      },
      priceRange: '€€€',
      availability: ['2025-05-15', '2025-06-20', '2025-07-10', '2025-08-05'],
      features: [
        'Kapacitet do 350 gostiju',
        'Profesionalno audio-vizuelna oprema',
        'Besplatni parking za 100 automobila',
        'Klima uređaji u cijelom objektu',
        'Vanjska terasa sa pogledom',
        'Dječji kutak',
        'Bridal suite',
        'WiFi pristup',
      ],
      openingHours: {
        'Ponedjeljak': '09:00 - 17:00',
        'Utorak': '09:00 - 17:00',
        'Srijeda': '09:00 - 17:00',
        'Četvrtak': '09:00 - 17:00',
        'Petak': '09:00 - 17:00',
        'Subota': 'Po dogovoru',
        'Nedjelja': 'Po dogovoru',
      },
      reviews: [
        {
          id: 'r1',
          author: 'Amina K.',
          rating: 5,
          comment: 'Savršeno mjesto za naše vjenčanje! Osoblje je bilo profesionalno i sve je prošlo bez problema. Preporučujem!',
          date: '2024-09-15',
        },
        {
          id: 'r2',
          author: 'Emir M.',
          rating: 4.5,
          comment: 'Odličan ambijent i usluga. Gosti su bili oduševljeni pogledom i hranom.',
          date: '2024-08-22',
        },
        {
          id: 'r3',
          author: 'Sara D.',
          rating: 5,
          comment: 'Najbolja odluka! Sve je bilo savršeno organizovano. Hvala vam što ste nam pomogli da ostvarimo naš san.',
          date: '2024-07-10',
        },
      ],
    },
    '2': {
      fullDescription: 'Royal Garden Hall kombinuje luksuz unutrašnjeg prostora sa ljepotom prirode. Naš prostor nudi elegantnu dvoranu i prekrasan vrt, idealan za vanjsku ceremoniju. Sa kapacitetom do 250 gostiju, pružamo intimnu ali prostornu atmosferu za vaše vjenčanje.',
      images: [
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
      ],
      address: 'Bulevar 88, Mostar 88000',
      phone: '+387 36 555 777',
      email: 'contact@royalgarden.ba',
      priceRange: '€€€',
      features: [
        'Vanjski vrt za ceremoniju',
        'Unutrašnja dvorana',
        'Parking',
        'WiFi',
        'Catering usluge',
      ],
      reviews: [
        {
          id: 'r4',
          author: 'Lejla B.',
          rating: 4.8,
          comment: 'Prekrasan vrt i odlična usluga!',
          date: '2024-06-05',
        },
      ],
    },
  };

  // Default details for vendors without specific mock data
  const defaultDetails: Partial<VendorDetails> = {
    fullDescription: vendor.shortDescription + ' Kontaktirajte nas za više informacija o našim uslugama i cijenama.',
    images: vendor.imageUrl ? [vendor.imageUrl] : [],
    address: `${vendor.city}, Bosna i Hercegovina`,
    priceRange: '€€',
    features: vendor.tags || [],
    reviews: [],
  };

  return {
    ...vendor,
    ...defaultDetails,
    ...detailsMap[vendorId],
  } as VendorDetails;
}

