import {NextResponse} from 'next/server';
import {getSupabase} from '@/shared/supabase/client';

export async function GET() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({routes: []});
    }

    const {data, error} = await supabase.from('routes').select('*');

    if (error) {
      return NextResponse.json({error: error.message}, {status: 500});
    }

    return NextResponse.json({routes: data || []});
  } catch (error) {
    return NextResponse.json(
      {error: 'Failed to read routes: ' + (error instanceof Error ? error.message : 'unknown')},
      {status: 500}
    );
  }
}
