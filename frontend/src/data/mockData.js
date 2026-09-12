export const ZIMBABWE_CITIES = [
  'Bulawayo',
  'Harare',
  'Gweru',
  'Mutare',
  'Masvingo',
  'Victoria Falls',
  'Kwekwe'
];

export const CATEGORIES = [
  { id: 'weddings', name: 'Wedding Venues', icon: 'Heart', description: 'Romantic estates, gardens, and luxury ballrooms' },
  { id: 'conferences', name: 'Conference Centres', icon: 'Presentation', description: 'High-tech auditoriums for summits and corporate workshops' },
  { id: 'gardens', name: 'Gardens & Outdoor Parks', icon: 'Sun', description: 'Lush manicured outdoor lawns for daytime celebrations' },
  { id: 'lodges', name: 'Hotels & Safari Lodges', icon: 'Building2', description: 'Executive hospitality spaces for retreats and banquets' },
  { id: 'halls', name: 'Church & Community Halls', icon: 'Users', description: 'Spacious, affordable halls for graduations and church events' },
  { id: 'restaurants', name: 'Restaurant Function Spaces', icon: 'Utensils', description: 'Private dining areas and rooftop cocktail lounges' }
];

export const EVENT_TYPES = [
  'Weddings',
  'Birthday Parties',
  'Corporate Events',
  'Conferences',
  'Church Events',
  'Graduations',
  'Baby Showers',
  'Bridal Showers',
  'Family Gatherings',
  'Funerals / Memorial Services',
  'Workshops & Seminars',
  'Product Launches',
  'Community Events',
  'School Events'
];

export const AMENITIES_LIST = [
  'Generator Backup',
  'Solar Power Backup',
  'Borehole Water Supply',
  'Ample Parking',
  'Professional Catering',
  'Tables & Chairs',
  'High-Speed Wi-Fi',
  'Security Staff',
  'Full Service Kitchen',
  'Surround Sound System',
  'HD Projector & Screen',
  'Air Conditioning',
  'Outdoor Garden',
  'Toilets & Restrooms',
  'Changing Rooms'
];

export const INITIAL_VENUES = [
  {
    id: 'v1',
    title: 'Mhlahlandlela Gardens & Event Pavilion',
    category: 'gardens',
    tagline: 'Lush manicured garden pavilion with reliable solar & generator backup in Bulawayo.',
    description: 'Mhlahlandlela Gardens offers a peaceful outdoor and covered venue nestled in Hillside, Bulawayo. Featuring manicured lawns, romantic gazebo arches, solar backup power, and dedicated borehole water supply, it is ideal for wedding receptions, graduations, and family reunions.',
    location: 'Bulawayo',
    suburb: 'Hillside',
    address: '42 Hillside Road, Bulawayo, Zimbabwe',
    capacity: 300,
    pricePerHour: 45,
    pricePerDay: 350,
    rating: 4.9,
    reviewCount: 48,
    ownerId: 'u2',
    status: 'approved',
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Solar Power Backup', 'Borehole Water Supply', 'Generator Backup', 'Ample Parking', 'Outdoor Garden', 'Tables & Chairs', 'Security Staff', 'Toilets & Restrooms'],
    rules: ['Music must adhere to local municipal guidelines by 11:30 PM', 'No fireworks permitted', 'Catering setup allowed 2 hours prior']
  },
  {
    id: 'v2',
    title: 'Harare Grand Event Pavilion',
    category: 'weddings',
    tagline: 'Opulent banquet hall and event centre in Borrowdale with full generator power.',
    description: 'Located in the prestigious Borrowdale area of Harare, the Harare Grand Event Pavilion is Zimbabwe’s premier destination for high-end wedding receptions, corporate galas, and national product launches. Equipped with uninterrupted generator power, sound systems, and VIP lounge amenities.',
    location: 'Harare',
    suburb: 'Borrowdale',
    address: '15 Borrowdale Road, Harare, Zimbabwe',
    capacity: 600,
    pricePerHour: 80,
    pricePerDay: 600,
    rating: 4.95,
    reviewCount: 62,
    ownerId: 'u2',
    status: 'approved',
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Generator Backup', 'Borehole Water Supply', 'Ample Parking', 'Professional Catering', 'Surround Sound System', 'Air Conditioning', 'High-Speed Wi-Fi', 'Security Staff'],
    rules: ['Decorators must use free-standing supports', 'Licensed catering partners required']
  },
  {
    id: 'v3',
    title: 'Gweru Garden Event Centre',
    category: 'gardens',
    tagline: 'Affordable, serene garden space in Gweru for family & church events.',
    description: 'Situated close to Gweru CBD, the Gweru Garden Event Centre provides an accessible, budget-friendly venue for church conferences, birthday parties, baby showers, and memorial gatherings. Outfitted with heavy-duty solar backup and clean borehole water.',
    location: 'Gweru',
    suburb: 'Gweru CBD',
    address: '88 Main Street, Gweru, Zimbabwe',
    capacity: 200,
    pricePerHour: 35,
    pricePerDay: 250,
    rating: 4.8,
    reviewCount: 34,
    ownerId: 'u2',
    status: 'approved',
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Solar Power Backup', 'Borehole Water Supply', 'Tables & Chairs', 'Ample Parking', 'Outdoor Garden', 'Toilets & Restrooms'],
    rules: ['Self-catering permitted with kitchen cleanup', 'Amplified sound allowed until 10:00 PM']
  },
  {
    id: 'v4',
    title: 'Victoria Falls Horizon Lodge & Terrace',
    category: 'lodges',
    tagline: 'Breathtaking terrace views near the Zambezi with executive conference rooms.',
    description: 'Perched in Victoria Falls, this world-class lodge venue offers open-air sunset terraces and air-conditioned conference rooms. Perfect for international corporate retreats, executive summits, and unforgettable destination weddings.',
    location: 'Victoria Falls',
    suburb: 'Zambezi Drive',
    address: '100 Zambezi Drive, Victoria Falls, Zimbabwe',
    capacity: 180,
    pricePerHour: 60,
    pricePerDay: 450,
    rating: 4.92,
    reviewCount: 55,
    ownerId: 'u2',
    status: 'approved',
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1545232979-fbfd42e000b5?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Generator Backup', 'Solar Power Backup', 'High-Speed Wi-Fi', 'Professional Catering', 'Air Conditioning', 'HD Projector & Screen', 'Security Staff'],
    rules: ['Wildlife guidelines apply near park boundary', 'In-house catering and beverage service']
  },
  {
    id: 'v5',
    title: 'Mutare Mountain View Pavilion',
    category: 'weddings',
    tagline: 'Scenic Eastern Highlands backdrop with spacious function hall.',
    description: 'Surrounded by the picturesque hills of Murambi, Mutare Mountain View Pavilion combines natural mountain scenery with modern function space. Features solar backup, borehole water supply, and ample parking for large wedding receptions.',
    location: 'Mutare',
    suburb: 'Murambi',
    address: '12 Murambi Drive, Mutare, Zimbabwe',
    capacity: 350,
    pricePerHour: 50,
    pricePerDay: 400,
    rating: 4.85,
    reviewCount: 41,
    ownerId: 'u2',
    status: 'approved',
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Solar Power Backup', 'Borehole Water Supply', 'Outdoor Garden', 'Ample Parking', 'Tables & Chairs', 'Changing Rooms'],
    rules: ['Outside caterers allowed with prior clearance', 'Event pack-up completed by midnight']
  },
  {
    id: 'v6',
    title: 'Masvingo Great Zimbabwe Conference Hall',
    category: 'conferences',
    tagline: 'High-capacity conference venue equipped with HD screens and generator backup.',
    description: 'Located in Masvingo, this venue is ideal for provincial summits, corporate training, non-profit workshops, and school prize-giving ceremonies. Offers air conditioning, high-output generator backup, and full audiovisual support.',
    location: 'Masvingo',
    suburb: 'Masvingo CBD',
    address: '45 Robert Mugabe Way, Masvingo, Zimbabwe',
    capacity: 400,
    pricePerHour: 40,
    pricePerDay: 320,
    rating: 4.75,
    reviewCount: 29,
    ownerId: 'u2',
    status: 'approved',
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Generator Backup', 'HD Projector & Screen', 'Surround Sound System', 'Air Conditioning', 'High-Speed Wi-Fi', 'Security Staff'],
    rules: ['Technical setup test recommended 1 hour prior', 'No smoking within auditorium']
  },
  {
    id: 'v7',
    title: 'Kwekwe Central Community Event Hub',
    category: 'halls',
    tagline: 'Versatile community venue for church events, graduations, and celebrations.',
    description: 'A spacious, central community hall in Kwekwe featuring heavy-duty solar power, tables and chairs for 250 guests, and secure parking. A popular choice for graduations, birthday parties, and church gatherings.',
    location: 'Kwekwe',
    suburb: 'Kwekwe CBD',
    address: '10 Industrial Road, Kwekwe, Zimbabwe',
    capacity: 250,
    pricePerHour: 30,
    pricePerDay: 220,
    rating: 4.7,
    reviewCount: 22,
    ownerId: 'u2',
    status: 'approved',
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Solar Power Backup', 'Tables & Chairs', 'Ample Parking', 'Toilets & Restrooms', 'Full Service Kitchen'],
    rules: ['Community hall code of conduct applies', 'Hall must be swept clean after use']
  },
  {
    id: 'v8',
    title: 'Avondale Executive Conference Suites',
    category: 'conferences',
    tagline: 'Modern, air-conditioned meeting suite in Avondale, Harare.',
    description: 'Tailored for corporate board meetings, strategy workshops, and high-level training in Avondale, Harare. Features high-speed Wi-Fi, generator back-up, smart screen displays, and gourmet coffee break facilities.',
    location: 'Harare',
    suburb: 'Avondale',
    address: '34 King George Road, Avondale, Harare, Zimbabwe',
    capacity: 120,
    pricePerHour: 45,
    pricePerDay: 280,
    rating: 4.88,
    reviewCount: 39,
    ownerId: 'u2',
    status: 'approved',
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Generator Backup', 'High-Speed Wi-Fi', 'HD Projector & Screen', 'Air Conditioning', 'Ample Parking', 'Security Staff'],
    rules: ['Quiet hours in shared building areas', 'Catering order confirmation required 24h prior']
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: 'b101',
    venueId: 'v1',
    venueTitle: 'Mhlahlandlela Gardens & Event Pavilion',
    venueImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    location: 'Hillside, Bulawayo',
    customerId: 'u1',
    customerName: 'Tendai Moyo',
    customerEmail: 'tendai.moyo@connect.co.zw',
    customerPhone: '+263 77 123 4567',
    eventDate: '2026-10-15',
    startTime: '10:00',
    endTime: '18:00',
    guestCount: 220,
    eventType: 'Wedding Reception',
    totalPrice: 350,
    status: 'Confirmed',
    createdAt: '2026-09-01'
  },
  {
    id: 'b102',
    venueId: 'v2',
    venueTitle: 'Harare Grand Event Pavilion',
    venueImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80',
    location: 'Borrowdale, Harare',
    customerId: 'u1',
    customerName: 'Tendai Moyo',
    customerEmail: 'tendai.moyo@connect.co.zw',
    customerPhone: '+263 77 123 4567',
    eventDate: '2026-11-04',
    startTime: '09:00',
    endTime: '17:00',
    guestCount: 150,
    eventType: 'Corporate Summit',
    totalPrice: 600,
    status: 'Pending',
    createdAt: '2026-09-10'
  },
  {
    id: 'b103',
    venueId: 'v3',
    venueTitle: 'Gweru Garden Event Centre',
    venueImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80',
    location: 'Gweru CBD, Gweru',
    customerId: 'u3',
    customerName: 'Chipo Ndlovu',
    customerEmail: 'chipo.ndlovu@connect.co.zw',
    customerPhone: '+263 71 234 5678',
    eventDate: '2026-09-20',
    startTime: '11:00',
    endTime: '16:00',
    guestCount: 120,
    eventType: 'Graduation Party',
    totalPrice: 250,
    status: 'Confirmed',
    createdAt: '2026-09-05'
  }
];

export const INITIAL_USERS = [
  { id: 'u1', name: 'Tendai Moyo', email: 'tendai@connect.co.zw', phone: '+263 77 123 4567', role: 'customer', status: 'Active' },
  { id: 'u2', name: 'Farai Mugabe', email: 'farai@venueowner.co.zw', phone: '+263 77 987 6543', role: 'owner', status: 'Active' },
  { id: 'u3', name: 'Chipo Ndlovu', email: 'chipo@connect.co.zw', phone: '+263 71 234 5678', role: 'customer', status: 'Active' },
  { id: 'u4', name: 'Blessing Dube', email: 'admin@venueconnect.co.zw', phone: '+263 78 345 6789', role: 'admin', status: 'Active' }
];

export const CONTACT_INFO = {
  address: '100 Nelson Mandela Avenue, Harare & 50 Main Street, Bulawayo, Zimbabwe',
  phone1: '+263 77 123 4567',
  phone2: '+263 71 234 5678',
  email: 'info@venueconnect.co.zw',
  bookingsEmail: 'bookings@venueconnect.co.zw'
};

// AI Recommendation logic tailored for Zimbabwean market with natural rationale text
export function getRecommendedVenues(currentVenueId, venuesList, limit = 3) {
  const currentVenue = venuesList.find(v => v.id === currentVenueId);
  if (!currentVenue) return venuesList.slice(0, limit);

  return venuesList
    .filter(v => v.id !== currentVenueId)
    .map(v => {
      let score = 0;
      let reasons = [];

      // Location match
      if (v.location === currentVenue.location) {
        score += 50;
        reasons.push(`located in ${v.location}`);
      }

      // Capacity similarity
      const capDiff = Math.abs(v.capacity - currentVenue.capacity);
      if (capDiff <= 100) {
        score += 30;
        reasons.push(`accommodates up to ${v.capacity} guests`);
      }

      // Price similarity
      const priceDiff = Math.abs(v.pricePerDay - currentVenue.pricePerDay);
      if (priceDiff <= 150) {
        score += 20;
        reasons.push(`fits your budget at US$${v.pricePerDay}/day`);
      }

      // Key facilities
      const keyFacilities = [];
      if (v.amenities.includes('Solar Power Backup')) keyFacilities.push('Solar Power Backup');
      else if (v.amenities.includes('Generator Backup')) keyFacilities.push('Generator Backup');
      if (v.amenities.includes('Borehole Water Supply')) keyFacilities.push('Borehole Water');
      if (v.amenities.includes('Ample Parking')) keyFacilities.push('Parking');

      if (keyFacilities.length > 0) {
        score += keyFacilities.length * 10;
        reasons.push(`provides ${keyFacilities.join(', ')}`);
      }

      const naturalExplanation = `We recommend ${v.title} because it is ${reasons.join(', ')}.`;

      return { venue: v, score, naturalExplanation };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => ({ ...item.venue, naturalExplanation: item.naturalExplanation }));
}
