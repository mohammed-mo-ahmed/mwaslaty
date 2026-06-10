import {NextResponse} from 'next/server';
import {getSupabase} from '@/shared/supabase/client';

export async function GET() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({stops: []});
    }

    const {data, error} = await supabase.from('stops').select('*');

    if (error) {
      return NextResponse.json({error: error.message}, {status: 500});
    }

    return NextResponse.json({stops: data || []});
  } catch (error) {
    return NextResponse.json(
      {error: 'Failed to read stops: ' + (error instanceof Error ? error.message : 'unknown')},
      {status: 500}
    );
  }
}
