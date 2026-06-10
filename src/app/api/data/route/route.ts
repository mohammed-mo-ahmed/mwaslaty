import {NextResponse} from 'next/server';
import {getSupabase} from '@/shared/supabase/client';

export async function POST(request: Request) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({error: 'Supabase not configured'}, {status: 500});
    }

    const body = await request.json();
    const {fromId, toId, fromName, toName, duration, cost, type, lineName, transfers, steps} = body;

    if (!fromId || !toId || !fromName || !toName || !duration || !type || !steps?.length) {
      return NextResponse.json(
        {error: 'Missing required fields: fromId, toId, fromName, toName, duration, type, steps'},
        {status: 400}
      );
    }

    if (!['metro', 'bus', 'microbus', 'multi'].includes(type)) {
      return NextResponse.json(
        {error: 'type must be one of: metro, bus, microbus, multi'},
        {status: 400}
      );
    }

    const newRoute = {
      id: `custom-${Date.now()}`,
      from_id: fromId,
      to_id: toId,
      from_name: fromName,
      to_name: toName,
      duration,
      cost: cost || 'N/A',
      type,
      line_name: lineName || `${fromName} → ${toName}`,
      transfers: transfers || 0,
      steps,
    };

    const {error} = await supabase.from('routes').insert(newRoute as any);

    if (error) {
      return NextResponse.json({error: error.message}, {status: 500});
    }

    return NextResponse.json({success: true, route: newRoute});
  } catch (error) {
    return NextResponse.json(
      {error: 'Failed to save route: ' + (error instanceof Error ? error.message : 'unknown')},
      {status: 500}
    );
  }
}
