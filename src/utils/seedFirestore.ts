import { doc, setDoc, addDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '@/src/services/firebase';

const vendors = [
  { id: '1', businessName: 'Dream Wedding Venue', type: 'VENUE', city: 'Sarajevo', location: 'Ferhadija 12, Sarajevo', shortDescription: 'Elegantno mjesto za vaš savršen dan sa panoramskim pogledom.', fullDescription: 'Dream Wedding Venue je vaš savršeni izbor za najvažniji dan. Smješteni u srcu Sarajeva, nudimo elegantnu dvoranu sa kapacitetom do 350 gostiju.', imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800', images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800'], rating: 4.5, maxCapacity: 350, enabled: true, status: 'APPROVED', tags: ['Puno Mjesta', 'Parking', 'AC'], phone: '+387 33 123 456', email: 'info@dreamwedding.ba', priceRange: '€€€', features: ['Kapacitet do 350 gostiju', 'Parking', 'Klima uređaji', 'WiFi'] },
  { id: '2', businessName: 'Royal Garden Hall', type: 'VENUE', city: 'Mostar', location: 'Bulevar 88, Mostar', shortDescription: 'Luksuzna dvorana sa vrtom za vanjsku ceremoniju.', fullDescription: 'Royal Garden Hall kombinuje luksuz unutrašnjeg prostora sa ljepotom prirode.', imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800'], rating: 4.8, maxCapacity: 250, enabled: true, status: 'APPROVED', tags: ['Vrt', 'Parking', 'WiFi'], phone: '+387 36 555 777', email: 'contact@royalgarden.ba', priceRange: '€€€', features: ['Vanjski vrt', 'Unutrašnja dvorana', 'Parking', 'WiFi'] },
  { id: '3', businessName: 'Elegant Photography Studio', type: 'PHOTOGRAPHY', city: 'Banja Luka', location: 'Banja Luka, BiH', shortDescription: 'Profesionalni fotograf sa 10+ godina iskustva.', fullDescription: 'Specijaliziran za vjenčanja i portrete sa modernom opremom i drone snimanjem.', imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800', images: ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'], rating: 4.7, enabled: true, status: 'APPROVED', tags: ['Drone Snimanje', 'Video'], priceRange: '€€', features: ['Drone snimanje', 'Video', 'Digitalna galerija', 'Foto album'] },
  { id: '4', businessName: 'Sweet Dreams Catering', type: 'CATERING', city: 'Sarajevo', location: 'Sarajevo, BiH', shortDescription: 'Gurmanska hrana za vaše posebno vrijeme.', fullDescription: 'Tradicionalna i moderna kuhinja sa domaćim sastojcima. Kapacitet do 500 gostiju.', imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800', images: ['https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800'], rating: 4.6, maxCapacity: 500, enabled: true, status: 'APPROVED', tags: ['Vegansko', 'Halal', 'Kosher'], priceRange: '€€', features: ['Vegansko', 'Halal', 'Kosher', 'Dostava'] },
  { id: '5', businessName: 'Classic Floral Design', type: 'FLORIST', city: 'Tuzla', location: 'Tuzla, BiH', shortDescription: 'Kreativni aranžmani cvijeća za svaki događaj.', fullDescription: 'Svježe cvijeće dostupno cijele godine. Personalizovani aranžmani za vjenčanja.', imageUrl: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800', images: ['https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800'], rating: 4.4, enabled: true, status: 'APPROVED', tags: ['Organsko', 'Dostava'], priceRange: '€€', features: ['Organsko cvijeće', 'Dostava', 'Custom aranžmani'] },
  { id: '6', businessName: 'Harmony Music Band', type: 'BAND', city: 'Zenica', location: 'Zenica, BiH', shortDescription: 'Živa muzika za nezaboravnu atmosferu.', fullDescription: 'Repertoar od klasične do moderne muzike. Profesionalna oprema uključena.', imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', images: ['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'], rating: 4.9, enabled: true, status: 'APPROVED', tags: ['DJ', 'Karaoke', 'Svjetlo'], priceRange: '€€', features: ['DJ oprema', 'Karaoke', 'Svjetlosni efekti', 'MC usluge'] },
  { id: '7', businessName: 'Bridal Beauty Salon', type: 'BEAUTY', city: 'Sarajevo', location: 'Sarajevo, BiH', shortDescription: 'Profesionalna šminka i frizura za mladenke.', fullDescription: 'Iskustvo u radu sa različitim tipovima kose i kože. Probni termini dostupni.', imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800', images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800'], rating: 4.5, enabled: true, status: 'APPROVED', tags: ['Probni Termin', 'Domaća Posjeta'], priceRange: '€€', features: ['Probni termin', 'Domaća posjeta', 'Šminka za goste'] },
  { id: '8', businessName: 'Grand Ballroom', type: 'VENUE', city: 'Banja Luka', location: 'Banja Luka, BiH', shortDescription: 'Velika dvorana sa visokim stropovima i kristalnim lusterima.', fullDescription: 'Kapacitet do 400 gostiju. Idealno za luksuzna vjenčanja sa velikom pratnjom.', imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800', images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'], rating: 4.3, maxCapacity: 400, enabled: true, status: 'APPROVED', tags: ['Parking', 'AC', 'Bina'], priceRange: '€€€', features: ['Kapacitet do 400 gostiju', 'Bina', 'Parking', 'AC'] },
  { id: '9', businessName: 'Cake Art Studio', type: 'CAKE_SWEET_TABLE', city: 'Mostar', location: 'Mostar, BiH', shortDescription: 'Umjetnički dizajnirani kolači i torte.', fullDescription: 'Personalizovani ukusi i dekoracije po vašoj želji. Bez glutena i veganske opcije.', imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800', images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800'], rating: 4.8, enabled: true, status: 'APPROVED', tags: ['Bez Glutena', 'Vegansko', 'Dostava'], priceRange: '€€', features: ['Bez glutena', 'Vegansko', 'Dostava', 'Custom dizajn'] },
  { id: '10', businessName: 'Luxury Limousine Service', type: 'LUXURY_CAR', city: 'Sarajevo', location: 'Sarajevo, BiH', shortDescription: 'Luksuzni vozni park za vaš poseban dan.', fullDescription: 'Profesionalni vozači i elegantna vozila. Dostupno 24/7.', imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800', images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800'], rating: 4.6, enabled: true, status: 'APPROVED', tags: ['Aerodrom', '24/7', 'Osiguranje'], priceRange: '€€€', features: ['Aerodrom transfer', '24/7 dostupnost', 'Osiguranje'] },
  { id: '11', businessName: 'Riverside Venue', type: 'VENUE', city: 'Mostar', location: 'Mostar, BiH', shortDescription: 'Romantično mjesto pored rijeke sa prekrasnim pogledom.', fullDescription: 'Idealno za vanjska vjenčanja sa kapacitetom do 200 gostiju.', imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800'], rating: 4.7, maxCapacity: 200, enabled: true, status: 'APPROVED', tags: ['Vanjski Prostor', 'Parking', 'WiFi'], priceRange: '€€', features: ['Vanjski prostor', 'Parking', 'WiFi'] },
  { id: '12', businessName: 'Vintage Photo Booth', type: 'PHOTOBOOTH', city: 'Banja Luka', location: 'Banja Luka, BiH', shortDescription: 'Zabavni foto booth sa rekvizitima za nezaboravne uspomene.', fullDescription: 'Instant print i digitalne kopije. Dostava i postavljanje uključeni.', imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800', images: ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'], rating: 4.4, enabled: true, status: 'APPROVED', tags: ['Rekviziti', 'Instant Print', 'Digitalno'], priceRange: '€', features: ['Rekviziti', 'Instant print', 'Digitalne kopije'] },
  { id: '13', businessName: 'Gourmet Catering Co.', type: 'CATERING', city: 'Tuzla', location: 'Tuzla, BiH', shortDescription: 'Fine dining iskustvo za vaše goste.', fullDescription: 'Internacionalna kuhinja sa lokalnim twistom. Kapacitet do 300 gostiju.', imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800', images: ['https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800'], rating: 4.9, maxCapacity: 300, enabled: true, status: 'APPROVED', tags: ['Gurmansko', 'Organsko', 'Vegansko'], priceRange: '€€€', features: ['Gurmansko', 'Organsko', 'Vegansko'] },
  { id: '14', businessName: 'Garden Party Venue', type: 'VENUE', city: 'Zenica', location: 'Zenica, BiH', shortDescription: 'Prekrasan vrt sa šatorom za vanjska vjenčanja.', fullDescription: 'Prirodna atmosfera i kapacitet do 150 gostiju. Idealno za ljetna vjenčanja.', imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800', images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'], rating: 4.2, maxCapacity: 150, enabled: true, status: 'APPROVED', tags: ['Vrt', 'Šator', 'Parking'], priceRange: '€€', features: ['Vrt', 'Šator', 'Parking'] },
  { id: '15', businessName: 'Elite Wedding Planner', type: 'WEDDING_ORGANIZER', city: 'Sarajevo', location: 'Sarajevo, BiH', shortDescription: 'Kompletno planiranje vašeg vjenčanja od A do Ž.', fullDescription: 'Iskustvo u organizaciji luksuznih događaja. Full service planiranje uključeno.', imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800', images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'], rating: 4.8, enabled: true, status: 'APPROVED', tags: ['Full Service', 'Koordinacija', '24/7 Podrška'], priceRange: '€€€', features: ['Full service', 'Koordinacija', '24/7 podrška', 'Budget planiranje'] },
];

export async function seedFirestore() {
  // users
  await setDoc(doc(db, 'users', 'test-user-1'), {
    name: 'Jane & John',
    email: 'test@example.com',
    role: 'CLIENT',
    weddingId: 'wedding-1',
  });

  // weddings
  await setDoc(doc(db, 'weddings', 'wedding-1'), {
    coupleName: 'Jane & John',
    weddingDate: '2026-08-14',
    city: 'Sarajevo',
    style: 'MODERN',
    guestCountRange: { min: 120, max: 160 },
    budgetRange: { min: 12000, max: 20000, currency: 'EUR' },
    createdAt: new Date().toISOString(),
  });

  // vendors — use IDs matching the mock data so home/search taps work
  for (const { id, ...data } of vendors) {
    await setDoc(doc(db, 'vendors', id), data);
  }

  // clear existing favorites then re-seed
  const favSnap = await getDocs(collection(db, 'weddings', 'wedding-1', 'favorites'));
  await Promise.all(favSnap.docs.map((d) => deleteDoc(d.ref)));

  await addDoc(collection(db, 'weddings', 'wedding-1', 'favorites'), {
    vendorId: '1',
    likedAt: new Date().toISOString(),
  });
  await addDoc(collection(db, 'weddings', 'wedding-1', 'favorites'), {
    vendorId: '2',
    likedAt: new Date().toISOString(),
  });
  await addDoc(collection(db, 'weddings', 'wedding-1', 'favorites'), {
    vendorId: '3',
    likedAt: new Date().toISOString(),
  });

  console.log('Firestore seeded successfully');
}
