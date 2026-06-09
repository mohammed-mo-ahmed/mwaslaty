import type {GeocodeResult} from '../types';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';

export async function geocode(query: string): Promise<GeocodeResult | null> {
  const url = `${NOMINATIM_URL}/search?format=json&q=${encodeURIComponent(query)}&limit=1&accept-language=ar,en`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mwaslaty/1.0 (chatbot assistant)'
      }
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data.length) return null;

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      displayName: data[0].display_name
    };
  } catch {
    return null;
  }
}

export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  const url = `${NOMINATIM_URL}/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar,en`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mwaslaty/1.0 (chatbot assistant)'
      }
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.display_name || null;
  } catch {
    return null;
  }
}
