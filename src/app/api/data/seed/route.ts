import {NextResponse} from 'next/server';
import {seedAll} from '@/shared/supabase/seed';

export async function POST() {
  try {
    const result = await seedAll();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {error: error instanceof Error ? error.message : 'Unknown error'},
      {status: 500}
    );
  }
}
