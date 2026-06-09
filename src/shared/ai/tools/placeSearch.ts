import type {PlaceResult} from '../types';
import {geocode} from './geocode';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

type OverpassElement = {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: {lat: number; lon: number};
  tags?: Record<string, string>;
};

function buildOverpassQuery(lat: number, lng: number, query: string): string {
  const placeType = mapQueryToPlaceType(query);
  const radius = 2000;

  if (placeType) {
    return `
      [out:json][timeout:15];
      (
        node["amenity"="${placeType}"](around:${radius},${lat},${lng});
        way["amenity"="${placeType}"](around:${radius},${lat},${lng});
      );
      out center 10;
    `.trim();
  }

  return `
    [out:json][timeout:15];
    (
      node["name"~"${query}"](around:${radius},${lat},${lng});
      way["name"~"${query}"](around:${radius},${lat},${lng});
      node["amenity"](around:${radius},${lat},${lng});
      way["amenity"](around:${radius},${lat},${lng});
    );
    out center 10;
  `.trim();
}

function mapQueryToPlaceType(query: string): string | null {
  const q = query.toLowerCase();

  if (/مطعم|restaurant|اكل|اكلات|food|eating/i.test(q)) return 'restaurant';
  if (/كافيه|cafe|قهوة|coffee/i.test(q)) return 'cafe';
  if (/مستشفى|hospital|دكتور|doctor|عيادة|clinic/i.test(q)) return 'hospital';
  if (/صيدلية|pharmacy|دواء|medicine/i.test(q)) return 'pharmacy';
  if (/سوبر ماركت|supermarket|market|بقالة|grocery/i.test(q)) return 'supermarket';
  if (/بنك|bank|صراف|atm/i.test(q)) return 'bank';
  if (/مسجد|mosque|masjid/i.test(q)) return 'place_of_worship';
  if (/مدرسة|school|معهد|institute/i.test(q)) return 'school';
  if (/جامعة|university|كلية|college/i.test(q)) return 'university';
  if (/فندق|hotel|اوتيل/i.test(q)) return 'hotel';
  if (/موقف|bus station|محطة|station/i.test(q)) return 'bus_station';
  if (/مترو|metro/i.test(q)) return 'subway_entrance';
  if (/بار|bar|نادي|club/i.test(q)) return 'bar';
  if (/حديقة|park|جنين|garden/i.test(q)) return 'park';
  if (/مواقف|parking/i.test(q)) return 'parking';

  return null;
}

function calcDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): string {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  if (d < 1) return `${Math.round(d * 1000)} m`;
  return `${d.toFixed(1)} km`;
}

async function searchByOverpass(
  lat: number,
  lng: number,
  query: string
): Promise<PlaceResult[]> {
  const overpassQuery = buildOverpassQuery(lat, lng, query);

  try {
    const res = await fetch(OVERPASS_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `data=${encodeURIComponent(overpassQuery)}`
    });

    if (!res.ok) return [];

    const data = await res.json();
    const elements: OverpassElement[] = data.elements || [];

    return elements
      .filter((el) => el.tags?.name)
      .slice(0, 10)
      .map((el) => {
        const elLat = el.lat ?? el.center?.lat ?? lat;
        const elLng = el.lon ?? el.center?.lon ?? lng;

        return {
          id: `${el.type}/${el.id}`,
          name: el.tags?.name || '',
          rating: el.tags?.stars ? parseFloat(el.tags.stars) : undefined,
          address: el.tags?.['addr:full'] || el.tags?.['addr:street'] || '',
          distance: calcDistance(lat, lng, elLat, elLng),
          type: el.tags?.amenity || el.tags?.shop || el.tags?.leisure || '',
          phone: el.tags?.phone || el.tags?.['contact:phone']
        };
      });
  } catch {
    return [];
  }
}

export async function searchPlaces(
  query: string,
  location?: string
): Promise<{places: PlaceResult[]; text: string}> {
  let lat = 30.0444;
  let lng = 31.2357;
  let locationName = 'القاهرة';

  if (location) {
    const coords = await geocode(location + '، مصر');
    if (coords) {
      lat = coords.lat;
      lng = coords.lng;
      locationName = coords.displayName;
    }
  }

  const places = await searchByOverpass(lat, lng, query);

  if (!places.length) {
    return {
      places: [],
      text: `عذراً، ما لقيتش نتائج لـ "${query}"${location ? ` في ${locationName}` : ''}. جرب تغيير البحث أو استخدام كلمات تانية.`
    };
  }

  const topPlaces = places.slice(0, 5);
  const placeNames = topPlaces
    .map((p) => `• ${p.name}${p.rating ? ` (${p.rating}/5 ⭐)` : ''}${p.distance ? ` - ${p.distance}` : ''}`)
    .join('\n');

  return {
    places: topPlaces,
    text: `لقيت لك كذا اختيار لـ "${query}"${location ? ` في ${locationName}` : ''}:\n${placeNames}\n\nعايز تفاصيل أكتر عن أي مكان؟`
  };
}
