import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/shared/firebase/admin';
import { createAuthenticatedClient } from '@/shared/supabase/server-client';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing authorization' }, { status: 401 });
    }

    const decoded = await verifyFirebaseToken(authHeader.slice(7));
    const supabase = createAuthenticatedClient(decoded);

    const body = await request.json();
    const { body: replyBody } = body;

    if (!replyBody?.trim()) {
      return NextResponse.json({ error: 'Reply body is required' }, { status: 400 });
    }

    const newReply = {
      post_id: parseInt(params.id, 10),
      user_id: decoded.uid,
      author_name: decoded.name || decoded.email || 'Anonymous',
      body: replyBody.trim(),
    };

    const { data, error } = await supabase
      .from('forum_replies')
      .insert(newReply)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, reply: data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add reply: ' + (error instanceof Error ? error.message : 'unknown') },
      { status: 500 }
    );
  }
}
