import type {RouteOption, GeocodeResult} from '../types';
import {geocode} from './geocode';

const OSRM_URL = 'https://router.project-osrm.org';

const FALLBACK_STOPS: Record<string, {lat: number; lng: number}> = {
  'رمسيس': {lat: 30.0636, lng: 31.2469},
  'ramses': {lat: 30.0636, lng: 31.2469},
  'التحرير': {lat: 30.0444, lng: 31.2357},
  'tahrir': {lat: 30.0444, lng: 31.2357},
  'المعادي': {lat: 29.9667, lng: 31.2667},
  'maadi': {lat: 29.9667, lng: 31.2667},
  'مدينة نصر': {lat: 30.0483, lng: 31.3656},
  'nasr city': {lat: 30.0483, lng: 31.3656},
  'مصر الجديدة': {lat: 30.1109, lng: 31.3309},
  'heliopolis': {lat: 30.1109, lng: 31.3309},
  'القاهرة الجديدة': {lat: 30.0159, lng: 31.4317},
  'new cairo': {lat: 30.0159, lng: 31.4317},
  'المطار': {lat: 30.1119, lng: 31.4101},
  'airport': {lat: 30.1119, lng: 31.4101},
  'العبور': {lat: 30.2147, lng: 31.4606},
  'obour': {lat: 30.2147, lng: 31.4606},
  'الشروق': {lat: 30.1431, lng: 31.6344},
  'shorouk': {lat: 30.1431, lng: 31.6344},
  'المهندسين': {lat: 30.0451, lng: 31.2107},
  'mohandeseen': {lat: 30.0451, lng: 31.2107},
  'الدقي': {lat: 30.0365, lng: 31.2091},
  'dokki': {lat: 30.0365, lng: 31.2091},
  'الجيزة': {lat: 30.0094, lng: 31.2089},
  'giza': {lat: 30.0094, lng: 31.2089},
  'السادس من أكتوبر': {lat: 29.9767, lng: 30.9474},
  '6th october': {lat: 29.9767, lng: 30.9474},
  'الأسكندرية': {lat: 31.2001, lng: 29.9187},
  'alexandria': {lat: 31.2001, lng: 29.9187},
  'المنصورة': {lat: 31.0419, lng: 31.3789},
  'mansoura': {lat: 31.0419, lng: 31.3789},
  'طنطا': {lat: 30.7865, lng: 31.0004},
  'taanta': {lat: 30.7865, lng: 31.0004}
};

async function resolveCoords(location: string): Promise<GeocodeResult | null> {
  const cached = FALLBACK_STOPS[location.toLowerCase().trim()];
  if (cached) {
    return {lat: cached.lat, lng: cached.lng, displayName: location};
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
