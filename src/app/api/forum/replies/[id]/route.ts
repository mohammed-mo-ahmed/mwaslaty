import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/shared/firebase/admin';
import { createAuthenticatedClient } from '@/shared/supabase/server-client';

export async function PATCH(
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

    const { data: existing } = await supabase
      .from('forum_replies')
      .select('user_id')
      .eq('id', params.id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Reply not found' }, { status: 404 });
    }

    if (existing.user_id !== decoded.uid) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const body = await request.json();
    if (!body.body?.trim()) {
      return NextResponse.json({ error: 'Body is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('forum_replies')
      .update({ body: body.body.trim() })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, reply: data });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'unknown';
    console.error('[forum PATCH reply] error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
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

    const { data: existing } = await supabase
      .from('forum_replies')
      .select('user_id')
      .eq('id', params.id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Reply not found' }, { status: 404 });
    }

    if (existing.user_id !== decoded.uid) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const { error } = await supabase
      .from('forum_replies')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'unknown';
    console.error('[forum DELETE reply] error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
