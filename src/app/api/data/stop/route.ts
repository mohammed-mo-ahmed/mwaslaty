import {NextResponse} from 'next/server';
import {getSupabase} from '@/shared/supabase/client';

export async function POST(request: Request) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({error: 'Supabase not configured'}, {status: 500});
    }

    const body = await request.json();
    const {name, nameAr, lat, lng, area, lines} = body;

    if (!name || !nameAr || lat === undefined || lng === undefined || !area) {
      return NextResponse.json(
        {error: 'Missing required fields: name, nameAr, lat, lng, area'},
        {status: 400}
      );
    }

    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return NextResponse.json(
        {error: 'lat and lng must be numbers'},
        {status: 400}
      );
    }

    const newStop = {
      id: `custom-${Date.now()}`,
      name,
      name_ar: nameAr,
      lat,
      lng,
      area,
      lines: lines || [],
      zone: 'cairo',
    };

    const {error} = await supabase.from('stops').insert(newStop as any);

    if (error) {
      return NextResponse.json({error: error.message}, {status: 500});
    }

    return NextResponse.json({success: true, stop: newStop});
  } catch (error) {
    return NextResponse.json(
      {error: 'Failed to save stop: ' + (error instanceof Error ? error.message : 'unknown')},
      {status: 500}
    );
  }
}
