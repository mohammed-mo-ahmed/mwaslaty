import {stops} from '../ai/data/stops';
import {routes} from '../ai/data/routes';
import {getSupabase} from './client';

export async function seedStops() {
  const supabase = getSupabase();
  if (!supabase) return {error: 'Supabase not configured', count: 0};

  const rows = stops.map(s => ({
    id: s.id,
    name: s.name,
    name_ar: s.nameAr,
    lat: s.lat,
    lng: s.lng,
    area: s.area,
    lines: s.lines,
    zone: s.zone,
  }));

  const {error} = await supabase
    .from('stops')
    .upsert(rows as any, {onConflict: 'id'});

  if (error) return {error: error.message, count: 0};
  return {error: null, count: rows.length};
}

export async function seedRoutes() {
  const supabase = getSupabase();
  if (!supabase) return {error: 'Supabase not configured', count: 0};

  const rows = routes.map(r => ({
    id: r.id,
    from_id: r.fromId,
    to_id: r.toId,
    from_name: r.fromName,
    to_name: r.toName,
    duration: r.duration,
    cost: r.cost,
    type: r.type,
    line_name: r.lineName,
    transfers: r.transfers,
    steps: r.steps as unknown as Record<string, unknown>[],
  }));

  const {error} = await supabase
    .from('routes')
    .upsert(rows as any, {onConflict: 'id'});

  if (error) return {error: error.message, count: 0};
  return {error: null, count: rows.length};
}

export async function seedAll() {
  const stopsResult = await seedStops();
  const routesResult = await seedRoutes();
  return {stops: stopsResult, routes: routesResult};
}
