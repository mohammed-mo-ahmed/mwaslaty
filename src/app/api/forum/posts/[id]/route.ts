import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/shared/supabase/client';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });

    const { data: post, error: postError } = await supabase
      .from('forum_posts')
      .select('*')
      .eq('id', params.id)
      .single();

    if (postError) {
      return NextResponse.json({ error: postError.message }, { status: 404 });
    }

    const { data: replies, error: replyError } = await supabase
      .from('forum_replies')
      .select('*')
      .eq('post_id', params.id)
      .order('created_at', { ascending: true });

    if (replyError) {
      return NextResponse.json({ error: replyError.message }, { status: 500 });
    }

    return NextResponse.json({ post, replies: replies ?? [] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load post' },
      { status: 500 }
    );
  }
}
