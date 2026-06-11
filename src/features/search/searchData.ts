import {routes} from '@/shared/ai/data/routes';
import {stops} from '@/shared/ai/data/stops';
import type {TransitRoute, TransitStop} from '@/shared/ai/data/stops';

export type RouteSearchResult = {
  route: TransitRoute;
  label: string;
};

export type RouteDetails = {
  route: TransitRoute;
  originStop: TransitStop | null;
  destStop: TransitStop | null;
  lineStops: TransitStop[];
  path: [number, number][];
};

function matchLineStops(lineName: string): TransitStop[] {
  const segments = lineName.split(/[→+]/).map(s => s.trim().toLowerCase());

  return stops.filter(s =>
    s.lines.some(line =>
      segments.some(seg => line.toLowerCase().includes(seg))
    )
  );
}

function generatePath(from: TransitStop | null, to: TransitStop | null): [number, number][] {
  if (!from || !to) return [];

  const midLat = (from.lat + to.lat) / 2;
  const midLng = (from.lng + to.lng) / 2;

  const dLat = to.lat - from.lat;
  const dLng = to.lng - from.lng;
  const perpLat = -dLng * 0.15;
  const perpLng = dLat * 0.15;

  return [
    [from.lat, from.lng] as [number, number],
    [midLat + perpLat, midLng + perpLng] as [number, number],
    [to.lat, to.lng] as [number, number],
  ];
}

export function searchRoutes(query: string): RouteSearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: RouteSearchResult[] = [];

  for (const route of routes) {
    const searchableText = [
      route.lineName.toLowerCase(),
      route.fromName.toLowerCase(),
      route.toName.toLowerCase(),
      route.id.toLowerCase(),
    ].join(' ');

    if (searchableText.includes(q)) {
      const label = `${route.lineName} - ${route.fromName} → ${route.toName}`;
      results.push({route, label});
    }
  }

  const seen = new Set<string>();
  return results
    .filter(r => {
      if (seen.has(r.route.id)) return false;
      seen.add(r.route.id);
      return true;
    })
    .slice(0, 10);
}

export function getRouteDetails(route: TransitRoute): RouteDetails {
  const originStop = stops.find(s => s.id === route.fromId) ?? null;
  const destStop = stops.find(s => s.id === route.toId) ?? null;
  const lineStops = matchLineStops(route.lineName);
  const path = generatePath(originStop, destStop);

  return {route, originStop, destStop, lineStops, path};
}
