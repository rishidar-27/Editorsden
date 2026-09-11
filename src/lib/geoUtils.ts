// Comprehensive world coordinates mapping for major cities & creative hubs
export interface GeoLocation {
  lat: number;
  lng: number;
  cityName: string;
  country: string;
}

const CITY_COORDINATES: Record<string, { lat: number; lng: number; country: string }> = {
  // North America - USA
  'san francisco': { lat: 37.7749, lng: -122.4194, country: 'United States' },
  'los angeles': { lat: 34.0522, lng: -118.2437, country: 'United States' },
  'new york': { lat: 40.7128, lng: -74.006, country: 'United States' },
  'nyc': { lat: 40.7128, lng: -74.006, country: 'United States' },
  'austin': { lat: 30.2672, lng: -97.7431, country: 'United States' },
  'seattle': { lat: 47.6062, lng: -122.3321, country: 'United States' },
  'chicago': { lat: 41.8781, lng: -87.6298, country: 'United States' },
  'miami': { lat: 25.7617, lng: -80.1918, country: 'United States' },
  'boston': { lat: 42.3601, lng: -71.0589, country: 'United States' },
  'denver': { lat: 39.7392, lng: -104.9903, country: 'United States' },
  'atlanta': { lat: 33.749, lng: -84.388, country: 'United States' },
  'portland': { lat: 45.5152, lng: -122.6784, country: 'United States' },
  'dallas': { lat: 32.7767, lng: -96.797, country: 'United States' },
  'houston': { lat: 29.7604, lng: -95.3698, country: 'United States' },
  'san diego': { lat: 32.7157, lng: -117.1611, country: 'United States' },
  'phoenix': { lat: 33.4484, lng: -112.074, country: 'United States' },
  'las vegas': { lat: 36.1699, lng: -115.1398, country: 'United States' },
  'nashville': { lat: 36.1627, lng: -86.7816, country: 'United States' },

  // North America - Canada
  'toronto': { lat: 43.6532, lng: -79.3832, country: 'Canada' },
  'vancouver': { lat: 49.2827, lng: -123.1207, country: 'Canada' },
  'montreal': { lat: 45.5017, lng: -73.5673, country: 'Canada' },
  'calgary': { lat: 51.0447, lng: -114.0719, country: 'Canada' },
  'ottawa': { lat: 45.4215, lng: -75.6972, country: 'Canada' },

  // Europe - UK & Ireland
  'london': { lat: 51.5074, lng: -0.1278, country: 'United Kingdom' },
  'manchester': { lat: 53.4808, lng: -2.2426, country: 'United Kingdom' },
  'birmingham': { lat: 52.4862, lng: -1.8904, country: 'United Kingdom' },
  'edinburgh': { lat: 55.9533, lng: -3.1883, country: 'United Kingdom' },
  'glasgow': { lat: 55.8642, lng: -4.2518, country: 'United Kingdom' },
  'dublin': { lat: 53.3498, lng: -6.2603, country: 'Ireland' },

  // Europe - Western & Central
  'berlin': { lat: 52.52, lng: 13.405, country: 'Germany' },
  'munich': { lat: 48.1351, lng: 11.582, country: 'Germany' },
  'frankfurt': { lat: 50.1109, lng: 8.6821, country: 'Germany' },
  'hamburg': { lat: 53.5511, lng: 9.9937, country: 'Germany' },
  'paris': { lat: 48.8566, lng: 2.3522, country: 'France' },
  'lyon': { lat: 45.764, lng: 4.8357, country: 'France' },
  'amsterdam': { lat: 52.3676, lng: 4.9041, country: 'Netherlands' },
  'rotterdam': { lat: 51.9244, lng: 4.4777, country: 'Netherlands' },
  'brussels': { lat: 50.8503, lng: 4.3517, country: 'Belgium' },
  'zurich': { lat: 47.3769, lng: 8.5417, country: 'Switzerland' },
  'geneva': { lat: 46.2044, lng: 6.1432, country: 'Switzerland' },
  'vienna': { lat: 48.2082, lng: 16.3738, country: 'Austria' },
  'madrid': { lat: 40.4168, lng: -3.7038, country: 'Spain' },
  'barcelona': { lat: 41.3879, lng: 2.1699, country: 'Spain' },
  'valencia': { lat: 39.4699, lng: -0.3763, country: 'Spain' },
  'lisbon': { lat: 38.7223, lng: -9.1393, country: 'Portugal' },
  'porto': { lat: 41.1579, lng: -8.6291, country: 'Portugal' },
  'rome': { lat: 41.9028, lng: 12.4964, country: 'Italy' },
  'milan': { lat: 45.4642, lng: 9.19, country: 'Italy' },
  'stockholm': { lat: 59.3293, lng: 18.0686, country: 'Sweden' },
  'copenhagen': { lat: 55.6761, lng: 12.5683, country: 'Denmark' },
  'oslo': { lat: 59.9139, lng: 10.7522, country: 'Norway' },
  'helsinki': { lat: 60.1699, lng: 24.9384, country: 'Finland' },
  'warsaw': { lat: 52.2297, lng: 21.0122, country: 'Poland' },
  'prague': { lat: 50.0755, lng: 14.4378, country: 'Czech Republic' },
  'budapest': { lat: 47.4979, lng: 19.0402, country: 'Hungary' },
  'athens': { lat: 37.9838, lng: 23.7275, country: 'Greece' },
  'bucharest': { lat: 44.4268, lng: 26.1025, country: 'Romania' },

  // Asia - India
  'mumbai': { lat: 19.076, lng: 72.8777, country: 'India' },
  'delhi': { lat: 28.6139, lng: 77.209, country: 'India' },
  'new delhi': { lat: 28.6139, lng: 77.209, country: 'India' },
  'bengaluru': { lat: 12.9716, lng: 77.5946, country: 'India' },
  'bangalore': { lat: 12.9716, lng: 77.5946, country: 'India' },
  'hyderabad': { lat: 17.385, lng: 78.4867, country: 'India' },
  'chennai': { lat: 13.0827, lng: 80.2707, country: 'India' },
  'kolkata': { lat: 22.5726, lng: 88.3639, country: 'India' },
  'pune': { lat: 18.5204, lng: 73.8567, country: 'India' },
  'ahmedabad': { lat: 23.0225, lng: 72.5714, country: 'India' },
  'kochi': { lat: 9.9312, lng: 76.2673, country: 'India' },
  'jaipur': { lat: 26.9124, lng: 75.7873, country: 'India' },

  // Asia - East & Southeast
  'tokyo': { lat: 35.6762, lng: 139.6503, country: 'Japan' },
  'osaka': { lat: 34.6937, lng: 135.5023, country: 'Japan' },
  'kyoto': { lat: 35.0116, lng: 135.7681, country: 'Japan' },
  'seoul': { lat: 37.5665, lng: 126.978, country: 'South Korea' },
  'singapore': { lat: 1.3521, lng: 103.8198, country: 'Singapore' },
  'bangkok': { lat: 13.7563, lng: 100.5018, country: 'Thailand' },
  'jakarta': { lat: -6.2088, lng: 106.8456, country: 'Indonesia' },
  'bali': { lat: -8.3405, lng: 115.092, country: 'Indonesia' },
  'kuala lumpur': { lat: 3.139, lng: 101.6869, country: 'Malaysia' },
  'manila': { lat: 14.5995, lng: 120.9842, country: 'Philippines' },
  'taipei': { lat: 25.033, lng: 121.5654, country: 'Taiwan' },
  'hong kong': { lat: 22.3193, lng: 114.1694, country: 'Hong Kong' },
  'beijing': { lat: 39.9042, lng: 116.4074, country: 'China' },
  'shanghai': { lat: 31.2304, lng: 121.4737, country: 'China' },
  'ho chi minh': { lat: 10.8231, lng: 106.6297, country: 'Vietnam' },
  'hanoi': { lat: 21.0285, lng: 105.8542, country: 'Vietnam' },

  // Middle East
  'dubai': { lat: 25.2048, lng: 55.2708, country: 'United Arab Emirates' },
  'abu dhabi': { lat: 24.4539, lng: 54.3773, country: 'United Arab Emirates' },
  'riyadh': { lat: 24.7136, lng: 46.6753, country: 'Saudi Arabia' },
  'doha': { lat: 25.2854, lng: 51.531, country: 'Qatar' },
  'tel aviv': { lat: 32.0853, lng: 34.7818, country: 'Israel' },
  'istanbul': { lat: 41.0082, lng: 28.9784, country: 'Turkey' },

  // Oceania
  'sydney': { lat: -33.8688, lng: 151.2093, country: 'Australia' },
  'melbourne': { lat: -37.8136, lng: 144.9631, country: 'Australia' },
  'brisbane': { lat: -27.4698, lng: 153.0251, country: 'Australia' },
  'perth': { lat: -31.9505, lng: 115.8605, country: 'Australia' },
  'auckland': { lat: -36.8485, lng: 174.7633, country: 'New Zealand' },
  'wellington': { lat: -41.2865, lng: 174.7762, country: 'New Zealand' },

  // Latin America
  'sao paulo': { lat: -23.5505, lng: -46.6333, country: 'Brazil' },
  'rio de janeiro': { lat: -22.9068, lng: -43.1729, country: 'Brazil' },
  'buenos aires': { lat: -34.6037, lng: -58.3816, country: 'Argentina' },
  'mexico city': { lat: 19.4326, lng: -99.1332, country: 'Mexico' },
  'bogota': { lat: 4.711, lng: -74.0721, country: 'Colombia' },
  'santiago': { lat: -33.4489, lng: -70.6693, country: 'Chile' },
  'lima': { lat: -12.0464, lng: -77.0428, country: 'Peru' },

  // Africa
  'cairo': { lat: 30.0444, lng: 31.2357, country: 'Egypt' },
  'cape town': { lat: -33.9249, lng: 18.4241, country: 'South Africa' },
  'johannesburg': { lat: -26.2041, lng: 28.0473, country: 'South Africa' },
  'nairobi': { lat: -1.2921, lng: 36.8219, country: 'Kenya' },
  'lagos': { lat: 6.5244, lng: 3.3792, country: 'Nigeria' },
  'casablanca': { lat: 33.5731, lng: -7.5898, country: 'Morocco' },
};

// Global fallback hubs for accounts without valid cities
const DEFAULT_HUBS = [
  { lat: 37.7749, lng: -122.4194, cityName: 'San Francisco, CA', country: 'United States' },
  { lat: 40.7128, lng: -74.006, cityName: 'New York, NY', country: 'United States' },
  { lat: 51.5074, lng: -0.1278, cityName: 'London, UK', country: 'United Kingdom' },
  { lat: 52.52, lng: 13.405, cityName: 'Berlin, Germany', country: 'Germany' },
  { lat: 35.6762, lng: 139.6503, cityName: 'Tokyo, Japan', country: 'Japan' },
  { lat: 19.076, lng: 72.8777, cityName: 'Mumbai, India', country: 'India' },
  { lat: -33.8688, lng: 151.2093, cityName: 'Sydney, Australia', country: 'Australia' },
  { lat: 43.6532, lng: -79.3832, cityName: 'Toronto, Canada', country: 'Canada' },
  { lat: 25.2048, lng: 55.2708, cityName: 'Dubai, UAE', country: 'United Arab Emirates' },
  { lat: 48.8566, lng: 2.3522, cityName: 'Paris, France', country: 'France' },
];

/**
 * Clean and extract a matching city from an input string
 */
function normalizeCityString(input: string): string {
  if (!input) return '';
  return input
    .toLowerCase()
    .replace(/[,\.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Simple deterministic hash from string to generate index and small offsets
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Resolves an editor's city string to coordinates [lat, lng].
 * Adds a deterministic small jitter based on editor.id so editors in the same city don't completely overlap.
 */
export function getEditorCoordinates(cityInput?: string, editorId: string = ''): GeoLocation {
  const normalized = normalizeCityString(cityInput || '');

  let baseLoc: { lat: number; lng: number; country: string } | null = null;
  let resolvedCity = cityInput?.trim() || '';

  if (normalized) {
    // 1. Direct match or substring match in CITY_COORDINATES
    for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
      if (normalized === key || normalized.includes(key) || key.includes(normalized)) {
        baseLoc = coords;
        resolvedCity = key.charAt(0).toUpperCase() + key.slice(1);
        break;
      }
    }
  }

  // 2. Fallback to deterministic creative hub if city is missing or unknown
  if (!baseLoc) {
    const hubIndex = hashString(editorId || normalized || 'editor') % DEFAULT_HUBS.length;
    const fallbackHub = DEFAULT_HUBS[hubIndex];
    baseLoc = { lat: fallbackHub.lat, lng: fallbackHub.lng, country: fallbackHub.country };
    resolvedCity = cityInput?.trim() || fallbackHub.cityName;
  }

  // 3. Apply subtle deterministic jitter (radius ~ 1-3km) so multiple editors in the same city don't stack directly on top
  const idHash = hashString(editorId);
  const angle = (idHash % 360) * (Math.PI / 180);
  const radiusKm = 0.015 + ((idHash % 10) * 0.005); // ~ 0.015 to 0.065 degrees

  const latOffset = Math.sin(angle) * radiusKm;
  const lngOffset = Math.cos(angle) * (radiusKm / Math.cos(baseLoc.lat * (Math.PI / 180)));

  return {
    lat: Number((baseLoc.lat + latOffset).toFixed(5)),
    lng: Number((baseLoc.lng + lngOffset).toFixed(5)),
    cityName: resolvedCity,
    country: baseLoc.country,
  };
}
