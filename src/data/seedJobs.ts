import { Job } from '../types';

export interface MetroCity {
  name: string;
  city: string;
  country: string;
  region: 'North America' | 'Europe' | 'Asia & Middle East' | 'Oceania' | 'Latin America' | 'Africa';
  lat: number;
  lng: number;
  currency: string;
  salaryMinBase: number;
  salaryMaxBase: number;
}

export const METRO_REGIONS = [
  'North America',
  'Europe',
  'Asia & Middle East',
  'Oceania',
  'Latin America',
  'Africa',
] as const;

export const WORLDWIDE_METROS: MetroCity[] = [
  // North America
  { name: 'Austin, USA', city: 'Austin', country: 'United States', region: 'North America', lat: 30.2672, lng: -97.7431, currency: '$', salaryMinBase: 130000, salaryMaxBase: 180000 },
  { name: 'San Francisco, USA', city: 'San Francisco', country: 'United States', region: 'North America', lat: 37.7749, lng: -122.4194, currency: '$', salaryMinBase: 155000, salaryMaxBase: 220000 },
  { name: 'New York, USA', city: 'New York', country: 'United States', region: 'North America', lat: 40.7128, lng: -74.006, currency: '$', salaryMinBase: 145000, salaryMaxBase: 210000 },
  { name: 'Seattle, USA', city: 'Seattle', country: 'United States', region: 'North America', lat: 47.6062, lng: -122.3321, currency: '$', salaryMinBase: 140000, salaryMaxBase: 195000 },
  { name: 'Toronto, Canada', city: 'Toronto', country: 'Canada', region: 'North America', lat: 43.6532, lng: -79.3832, currency: 'C$', salaryMinBase: 110000, salaryMaxBase: 160000 },
  { name: 'Vancouver, Canada', city: 'Vancouver', country: 'Canada', region: 'North America', lat: 49.2827, lng: -123.1207, currency: 'C$', salaryMinBase: 105000, salaryMaxBase: 155000 },
  { name: 'Chicago, USA', city: 'Chicago', country: 'United States', region: 'North America', lat: 41.8781, lng: -87.6298, currency: '$', salaryMinBase: 125000, salaryMaxBase: 175000 },
  { name: 'Los Angeles, USA', city: 'Los Angeles', country: 'United States', region: 'North America', lat: 34.0522, lng: -118.2437, currency: '$', salaryMinBase: 135000, salaryMaxBase: 190000 },
  { name: 'Boston, USA', city: 'Boston', country: 'United States', region: 'North America', lat: 42.3601, lng: -71.0589, currency: '$', salaryMinBase: 135000, salaryMaxBase: 185000 },
  { name: 'Denver, USA', city: 'Denver', country: 'United States', region: 'North America', lat: 39.7392, lng: -104.9903, currency: '$', salaryMinBase: 120000, salaryMaxBase: 165000 },
  { name: 'Mexico City, Mexico', city: 'Mexico City', country: 'Mexico', region: 'North America', lat: 19.4326, lng: -99.1332, currency: 'MX$', salaryMinBase: 650000, salaryMaxBase: 1100000 },

  // Europe
  { name: 'London, UK', city: 'London', country: 'United Kingdom', region: 'Europe', lat: 51.5074, lng: -0.1278, currency: '£', salaryMinBase: 85000, salaryMaxBase: 135000 },
  { name: 'Berlin, Germany', city: 'Berlin', country: 'Germany', region: 'Europe', lat: 52.52, lng: 13.405, currency: '€', salaryMinBase: 78000, salaryMaxBase: 115000 },
  { name: 'Paris, France', city: 'Paris', country: 'France', region: 'Europe', lat: 48.8566, lng: 2.3522, currency: '€', salaryMinBase: 72000, salaryMaxBase: 110000 },
  { name: 'Amsterdam, Netherlands', city: 'Amsterdam', country: 'Netherlands', region: 'Europe', lat: 52.3676, lng: 4.9041, currency: '€', salaryMinBase: 80000, salaryMaxBase: 125000 },
  { name: 'Dublin, Ireland', city: 'Dublin', country: 'Ireland', region: 'Europe', lat: 53.3498, lng: -6.2603, currency: '€', salaryMinBase: 85000, salaryMaxBase: 130000 },
  { name: 'Zurich, Switzerland', city: 'Zurich', country: 'Switzerland', region: 'Europe', lat: 47.3769, lng: 8.5417, currency: 'CHF ', salaryMinBase: 140000, salaryMaxBase: 195000 },
  { name: 'Stockholm, Sweden', city: 'Stockholm', country: 'Sweden', region: 'Europe', lat: 59.3293, lng: 18.0686, currency: 'kr ', salaryMinBase: 650000, salaryMaxBase: 950000 },
  { name: 'Madrid, Spain', city: 'Madrid', country: 'Spain', region: 'Europe', lat: 40.4168, lng: -3.7038, currency: '€', salaryMinBase: 55000, salaryMaxBase: 85000 },
  { name: 'Warsaw, Poland', city: 'Warsaw', country: 'Poland', region: 'Europe', lat: 52.2297, lng: 21.0122, currency: 'PLN ', salaryMinBase: 180000, salaryMaxBase: 280000 },

  // Asia & Middle East
  { name: 'Tokyo, Japan', city: 'Tokyo', country: 'Japan', region: 'Asia & Middle East', lat: 35.6762, lng: 139.6503, currency: '¥', salaryMinBase: 8500000, salaryMaxBase: 14000000 },
  { name: 'Singapore', city: 'Singapore', country: 'Singapore', region: 'Asia & Middle East', lat: 1.3521, lng: 103.8198, currency: 'S$', salaryMinBase: 110000, salaryMaxBase: 175000 },
  { name: 'Bangalore, India', city: 'Bangalore', country: 'India', region: 'Asia & Middle East', lat: 12.9716, lng: 77.5946, currency: '₹', salaryMinBase: 1800000, salaryMaxBase: 3500000 },
  { name: 'Mumbai, India', city: 'Mumbai', country: 'India', region: 'Asia & Middle East', lat: 19.076, lng: 72.8777, currency: '₹', salaryMinBase: 1700000, salaryMaxBase: 3200000 },
  { name: 'Hyderabad, India', city: 'Hyderabad', country: 'India', region: 'Asia & Middle East', lat: 17.385, lng: 78.4867, currency: '₹', salaryMinBase: 1600000, salaryMaxBase: 3000000 },
  { name: 'Seoul, South Korea', city: 'Seoul', country: 'South Korea', region: 'Asia & Middle East', lat: 37.5665, lng: 126.978, currency: '₩', salaryMinBase: 65000000, salaryMaxBase: 110000000 },
  { name: 'Dubai, UAE', city: 'Dubai', country: 'United Arab Emirates', region: 'Asia & Middle East', lat: 25.2048, lng: 55.2708, currency: 'AED ', salaryMinBase: 240000, salaryMaxBase: 380000 },
  { name: 'Tel Aviv, Israel', city: 'Tel Aviv', country: 'Israel', region: 'Asia & Middle East', lat: 32.0853, lng: 34.7818, currency: '₪', salaryMinBase: 320000, salaryMaxBase: 500000 },
  { name: 'Hong Kong', city: 'Hong Kong', country: 'Hong Kong', region: 'Asia & Middle East', lat: 22.3193, lng: 114.1694, currency: 'HK$', salaryMinBase: 550000, salaryMaxBase: 900000 },
  { name: 'Taipei, Taiwan', city: 'Taipei', country: 'Taiwan', region: 'Asia & Middle East', lat: 25.033, lng: 121.5654, currency: 'NT$', salaryMinBase: 1200000, salaryMaxBase: 2100000 },

  // Oceania
  { name: 'Sydney, Australia', city: 'Sydney', country: 'Australia', region: 'Oceania', lat: -33.8688, lng: 151.2093, currency: 'A$', salaryMinBase: 135000, salaryMaxBase: 195000 },
  { name: 'Melbourne, Australia', city: 'Melbourne', country: 'Australia', region: 'Oceania', lat: -37.8136, lng: 144.9631, currency: 'A$', salaryMinBase: 125000, salaryMaxBase: 180000 },
  { name: 'Auckland, New Zealand', city: 'Auckland', country: 'New Zealand', region: 'Oceania', lat: -36.8485, lng: 174.7633, currency: 'NZ$', salaryMinBase: 115000, salaryMaxBase: 165000 },

  // Latin America
  { name: 'São Paulo, Brazil', city: 'São Paulo', country: 'Brazil', region: 'Latin America', lat: -23.5505, lng: -46.6333, currency: 'R$ ', salaryMinBase: 140000, salaryMaxBase: 250000 },
  { name: 'Buenos Aires, Argentina', city: 'Buenos Aires', country: 'Argentina', region: 'Latin America', lat: -34.6037, lng: -58.3816, currency: 'US$', salaryMinBase: 45000, salaryMaxBase: 80000 },
  { name: 'Santiago, Chile', city: 'Santiago', country: 'Chile', region: 'Latin America', lat: -33.4489, lng: -70.6693, currency: 'CLP ', salaryMinBase: 25000000, salaryMaxBase: 42000000 },
  { name: 'Bogotá, Colombia', city: 'Bogotá', country: 'Colombia', region: 'Latin America', lat: 4.711, lng: -74.0721, currency: 'US$', salaryMinBase: 40000, salaryMaxBase: 75000 },

  // Africa
  { name: 'Cape Town, South Africa', city: 'Cape Town', country: 'South Africa', region: 'Africa', lat: -33.9249, lng: 18.4241, currency: 'R ', salaryMinBase: 650000, salaryMaxBase: 1100000 },
  { name: 'Nairobi, Kenya', city: 'Nairobi', country: 'Kenya', region: 'Africa', lat: -1.2921, lng: 36.8219, currency: 'KSh ', salaryMinBase: 2800000, salaryMaxBase: 5000000 },
  { name: 'Lagos, Nigeria', city: 'Lagos', country: 'Nigeria', region: 'Africa', lat: 6.5244, lng: 3.3792, currency: '₦', salaryMinBase: 12000000, salaryMaxBase: 25000000 },
];

export const CITIES = WORLDWIDE_METROS;

export const BASE_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Full Stack Engineer',
    company: 'CloudScale Systems',
    location: 'Central Metro Tech Hub (0.8 mi)',
    city: 'Local Area',
    lat: 30.269,
    lng: -97.742,
    type: 'Full-time',
    salaryMin: 140000,
    salaryMax: 180000,
    currency: '$',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
    description: 'Lead architecture for modern high-throughput SaaS analytics platform. Collaborate with cross-functional design and product squads.',
    postedDate: '10 minutes ago',
    source: 'direct',
    urgent: true,
  },
  {
    id: 'job-2',
    title: 'Frontend React Specialist',
    company: 'Fintech Velocity',
    location: 'Financial & Tech Corridor (3.4 mi)',
    city: 'Local Area',
    lat: 30.302,
    lng: -97.728,
    type: 'Hybrid',
    salaryMin: 125000,
    salaryMax: 155000,
    currency: '$',
    skills: ['React', 'Tailwind CSS', 'TypeScript', 'GraphQL', 'Next.js'],
    description: 'Build responsive trading dashboard interfaces with millisecond state updates and accessible interaction models.',
    postedDate: '32 minutes ago',
    source: 'linkedin',
    urgent: true,
  },
  {
    id: 'job-3',
    title: 'AI / ML Solutions Engineer',
    company: 'NeuralVision Labs',
    location: 'Innovation District (7.1 mi)',
    city: 'Local Area',
    lat: 30.401,
    lng: -97.722,
    type: 'Full-time',
    salaryMin: 160000,
    salaryMax: 210000,
    currency: '$',
    skills: ['Python', 'Gemini API', 'PyTorch', 'Vector Databases', 'TypeScript'],
    description: 'Integrate state-of-the-art LLMs, multimodal grounding, and automated retrieval pipelines into enterprise workflows.',
    postedDate: '1 hour ago',
    source: 'verified_partner',
  },
  {
    id: 'job-4',
    title: 'Staff Backend Architect',
    company: 'OmniStream Media',
    location: 'East Media Center (2.2 mi)',
    city: 'Local Area',
    lat: 30.245,
    lng: -97.725,
    type: 'Hybrid',
    salaryMin: 165000,
    salaryMax: 205000,
    currency: '$',
    skills: ['Go', 'Node.js', 'Kubernetes', 'Redis', 'Kafka', 'System Design'],
    description: 'Architect resilient event-driven microservices handling 250M daily video streaming analytics pings.',
    postedDate: '2 hours ago',
    source: 'direct',
  },
  {
    id: 'job-5',
    title: 'Mobile App Developer (React Native)',
    company: 'Pulse Healthcare Systems',
    location: 'Medical Innovation Park (4.5 mi)',
    city: 'Local Area',
    lat: 30.292,
    lng: -97.748,
    type: 'Full-time',
    salaryMin: 120000,
    salaryMax: 150000,
    currency: '$',
    skills: ['React Native', 'TypeScript', 'iOS', 'Android', 'REST APIs'],
    description: 'Craft real-time patient alert systems and mobile telehealth consultation modules integrated with Google Meet.',
    postedDate: '3 hours ago',
    source: 'linkedin',
  },
  {
    id: 'job-10',
    title: 'Global Full Stack Remote Engineer',
    company: 'HyperCloud Global',
    location: 'Worldwide Remote (Distributed)',
    city: 'Remote',
    lat: 0,
    lng: 0,
    type: 'Remote',
    salaryMin: 140000,
    salaryMax: 185000,
    currency: '$',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
    description: 'Distributed engineering team seeking experienced builder for asynchronous developer tooling and cloud dashboards.',
    postedDate: '8 hours ago',
    source: 'linkedin',
  },
];

/**
 * Creates dynamic jobs mapped closely around the user's specific coordinates and localized currency
 */
export function generateNearbyJobsForLocation(
  centerLat: number,
  centerLng: number,
  cityName: string,
  currency: string = '$',
  salaryRange?: [number, number]
): Job[] {
  // Offsets representing various nearby neighborhoods within 1 - 18 miles
  const offsets = [
    { dLat: 0.012, dLng: 0.008, title: 'Senior Full Stack Engineer', company: 'Apex Global Tech', area: 'Downtown Core', urgent: true },
    { dLat: -0.018, dLng: 0.015, title: 'Frontend React Developer', company: 'Pulse Interactive', area: 'Tech Innovation Park', urgent: true },
    { dLat: 0.045, dLng: -0.032, title: 'AI & Data Integration Lead', company: 'NovaSynthetics', area: 'North Business Campus', urgent: false },
    { dLat: -0.038, dLng: -0.025, title: 'Staff Cloud Infrastructure Architect', company: 'GridMatrix Corp', area: 'Enterprise Center', urgent: false },
    { dLat: 0.065, dLng: 0.048, title: 'Backend Node.js & Go Engineer', company: 'Vanguard Stream', area: 'Metro Gateway Plaza', urgent: false },
    { dLat: -0.082, dLng: 0.035, title: 'Mobile React Native Engineer', company: 'CareLink Health', area: 'Biomedical District', urgent: true },
    { dLat: 0.12, dLng: -0.08, title: 'Cybersecurity & Compliance Lead', company: 'SecureVault Technologies', area: 'Outer Gateway Center', urgent: false },
    { dLat: 0.002, dLng: -0.015, title: 'Lead Product UI/UX Developer', company: 'DesignCraft Labs', area: 'Creative Media District', urgent: false },
  ];

  const skillPools = [
    ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
    ['React', 'Tailwind CSS', 'TypeScript', 'GraphQL', 'Next.js'],
    ['Python', 'Gemini API', 'PyTorch', 'Vector Databases', 'TypeScript'],
    ['Terraform', 'AWS', 'Kubernetes', 'CI/CD Pipeline', 'Linux'],
    ['Go', 'Node.js', 'Kubernetes', 'Redis', 'Kafka', 'System Design'],
    ['React Native', 'TypeScript', 'iOS', 'Android', 'REST APIs'],
    ['SOC 2', 'Penetration Testing', 'Cloud Security', 'Python', 'OAuth'],
    ['Figma', 'React', 'Tailwind CSS', 'Design Systems', 'Accessibility'],
  ];

  const minBase = salaryRange ? salaryRange[0] : 130000;
  const maxBase = salaryRange ? salaryRange[1] : 180000;

  return offsets.map((item, index) => {
    // Slight variance per role
    const sMin = Math.round(minBase * (0.9 + (index % 4) * 0.07));
    const sMax = Math.round(maxBase * (0.95 + (index % 4) * 0.08));

    return {
      id: `local-job-${index + 1}`,
      title: item.title,
      company: item.company,
      location: `${item.area}`,
      city: cityName,
      lat: centerLat + item.dLat,
      lng: centerLng + item.dLng,
      type: index % 3 === 0 ? 'Full-time' : index % 3 === 1 ? 'Hybrid' : 'Contract',
      salaryMin: sMin,
      salaryMax: sMax,
      currency,
      skills: skillPools[index % skillPools.length],
      description: `Actively hiring immediate opening in ${cityName} (${item.area}). Fast-track interview cycle with direct Google Meet technical panel.`,
      postedDate: `${(index + 1) * 11} mins ago`,
      source: index % 2 === 0 ? 'direct' : 'linkedin',
      urgent: item.urgent,
    };
  });
}
