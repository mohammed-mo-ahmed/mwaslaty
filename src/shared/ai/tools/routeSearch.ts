import type {RouteOption, GeocodeResult} from '../types';
import {geocode} from './geocode';
import {searchLocalDatabase} from '../data';
import {findStop} from '../data/stops';

const OSRM_URL = 'https://router.project-osrm.org';

async function resolveCoords(location: string): Promise<GeocodeResult | null> {
  const stop = findStop(location);
  if (stop) {
    return {lat: stop.lat, lng: stop.lng, displayName: stop.nameAr};
  }

  const result = await geocode(location + '، مصر');
  return result;
}

async function osrmRoute(
  origin: GeocodeResult,
  destination: GeocodeResult
): Promise<{duration: number; distance: number} | null> {
  const coord = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
  const url = `${OSRM_URL}/route/v1/driving/${coord}?overview=false&alternatives=true`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();

    if (!data.routes?.length) return null;

    const best = data.routes[0];
    return {
      duration: best.duration,
      distance: best.distance
    };
  } catch {
    return null;
  }
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function formatDistance(meters: number): string {
  const km = meters / 1000;
  return `${km.toFixed(1)} km`;
}

export async function searchRoutes(
  origin: string,
  destination: string
): Promise<{routes: RouteOption[]; text: string}> {
  const dbResult = await searchLocalDatabase(origin, destination);

  if (dbResult.found) {
    return {routes: dbResult.routes, text: dbResult.text};
  }

  const [originCoords, destCoords] = await Promise.all([
    resolveCoords(origin),
    resolveCoords(destination)
  ]);

  if (!originCoords) {
    return {routes: [], text: `لم أتعرف على موقع "${origin}". هل يمكنك توضيح اسم المنطقة بشكل أدق؟`};
  }
  if (!destCoords) {
    return {routes: [], text: `لم أتعرف على موقع "${destination}". هل يمكنك توضيح اسم المنطقة بشكل أدق؟`};
  }

  const routeData = await osrmRoute(originCoords, destCoords);

  if (!routeData) {
    return {
      routes: [],
      text: 'عذراً، لم أتمكن من العثور على طريق بين هذين الموقعين حالياً. حاول استخدام محطات رئيسية معروفة.'
    };
  }

  const duration = formatDuration(routeData.duration);
  const distance = formatDistance(routeData.distance);
  const hours = Math.floor(routeData.duration / 3600);
  const trafficMinutes = Math.round((routeData.duration % 3600) / 60);
  const walkMinutes = Math.max(5, Math.round(routeData.distance / 100));
  const walkDuration = `${walkMinutes}m`;
  const estCost = routeData.distance < 10000 ? '5-10 EGP' : routeData.distance < 30000 ? '10-20 EGP' : '20-35 EGP';

  const mainRoute: RouteOption = {
    id: '1',
    duration,
    cost: estCost,
    transfers: 1,
    modes: ['walk', 'bus'],
    steps: [
      {
        instruction: `امشِ إلى أقرب موقف مواصلات من ${originCoords.displayName}`,
        duration: walkDuration,
        icon: 'walk'
      },
      {
        instruction: `استقل وسيلة مواصلات متجهة إلى ${destCoords.displayName}`,
        duration: `${hours}h ${trafficMinutes}m`,
        icon: 'bus'
      },
      {
        instruction: `انزل في ${destCoords.displayName} وامشِ إلى وجهتك`,
        duration: '5 min',
        icon: 'walk'
      }
    ]
  };

  const cheaperRoute: RouteOption = {
    id: '2',
    duration: `${hours + 1}h ${trafficMinutes + 15}m`,
    cost: routeData.distance < 10000 ? '3-7 EGP' : '8-15 EGP',
    transfers: 2,
    modes: ['walk', 'bus', 'microbus'],
    steps: [
      {
        instruction: `امشِ إلى موقف الميكروباص من ${originCoords.displayName}`,
        duration: walkDuration,
        icon: 'walk'
      },
      {
        instruction: 'استقل ميكروباص إلى أقرب محطة مواصلات رئيسية',
        duration: `${hours}h ${trafficMinutes}m`,
        icon: 'microbus'
      },
      {
        instruction: `استقل أتوبيس متجه إلى ${destCoords.displayName}`,
        duration: '30 min',
        icon: 'bus'
      },
      {
        instruction: `انزل وامشِ إلى وجهتك في ${destCoords.displayName}`,
        duration: '5 min',
        icon: 'walk'
      }
    ]
  };

  return {
    routes: [mainRoute, cheaperRoute],
    text: `لقيت لك طرق من ${originCoords.displayName} إلى ${destCoords.displayName}. المسافة تقريباً ${distance} والوقت حوالي ${duration}.`
  };
}
