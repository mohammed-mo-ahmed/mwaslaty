import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/shared/firebase/admin';
import { createAuthenticatedClient } from '@/shared/supabase/server-client';
import { getSupabase } from '@/shared/supabase/client';

export async function GET() {
  try {
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ posts: [] });

    const { data, error } = await supabase
      .from('forum_posts')
      .select('*, replies:forum_replies(count)')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const posts = (data ?? []).map((p: Record<string, unknown>) => ({
      ...p,
      replyCount: (p.replies as { count: number }[])?.[0]?.count ?? 0,
    }));

    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing authorization' }, { status: 401 });
    }

    const decoded = await verifyFirebaseToken(authHeader.slice(7));
    const supabase = createAuthenticatedClient(decoded);

    const body = await request.json();
    const { title, body: postBody } = body;

    if (!title?.trim() || !postBody?.trim()) {
      return NextResponse.json({ error: 'Title and body are required' }, { status: 400 });
    }

    const newPost = {
      user_id: decoded.uid,
      author_name: decoded.name || decoded.email || 'Anonymous',
      title: title.trim(),
      body: postBody.trim(),
    };

    const { data, error } = await supabase
      .from('forum_posts')
      .insert(newPost)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, post: { ...data, replyCount: 0 } });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'unknown';
    const stack = error instanceof Error ? error.stack : '';
    console.error('[forum POST] error:', msg, stack);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
