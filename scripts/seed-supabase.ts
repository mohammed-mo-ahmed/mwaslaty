import {createClient} from '@supabase/supabase-js';
import {stops} from '../src/shared/ai/data/stops';
import {routes} from '../src/shared/ai/data/routes';

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  console.log(`Seeding ${stops.length} stops...`);
  const stopRows = stops.map(s => ({
    id: s.id,
    name: s.name,
    name_ar: s.nameAr,
    lat: s.lat,
    lng: s.lng,
    area: s.area,
    lines: s.lines,
    zone: s.zone,
  }));

  const {error: stopError} = await supabase
    .from('stops')
    .upsert(stopRows, {onConflict: 'id'});

  if (stopError) {
    console.error('Stop seed error:', stopError.message);
  } else {
    console.log(`✓ ${stops.length} stops seeded`);
  }

  console.log(`Seeding ${routes.length} routes...`);
  const routeRows = routes.map(r => ({
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
    steps: r.steps,
  }));

  const {error: routeError} = await supabase
    .from('routes')
    .upsert(routeRows, {onConflict: 'id'});

  if (routeError) {
    console.error('Route seed error:', routeError.message);
  } else {
    console.log(`✓ ${routes.length} routes seeded`);
  }
}

main().catch(console.error);
