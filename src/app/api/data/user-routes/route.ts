import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/shared/firebase/admin';
import { createAuthenticatedClient } from '@/shared/supabase/server-client';
import { getSupabase } from '@/shared/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 });
    }

    const firebaseToken = authHeader.slice(7);
    const decoded = await verifyFirebaseToken(firebaseToken);
    const supabase = createAuthenticatedClient(decoded);

    const body = await request.json();
    const { name, origin, destination, fare, duration, type } = body;

    if (!name || !origin || !destination || !fare || !duration || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: name, origin, destination, fare, duration, type' },
        { status: 400 }
      );
    }

    if (!['Metro', 'Bus', 'Microbus'].includes(type)) {
      return NextResponse.json({ error: 'type must be Metro, Bus, or Microbus' }, { status: 400 });
    }

    const newRoute = {
      name,
      origin,
      destination,
      fare,
      duration,
      type,
      submitted_by: decoded.uid,
      votes_up: 0,
      votes_down: 0,
      status: 'pending',
    };

    const { data, error } = await supabase
      .from('user_routes')
      .insert(newRoute)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, route: data });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          'Failed to save route: ' +
          (error instanceof Error ? error.message : 'unknown'),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ routes: [] });
    }

    const { data, error } = await supabase
      .from('user_routes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ routes: data || [] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load routes' },
      { status: 500 }
    );
  }
}
