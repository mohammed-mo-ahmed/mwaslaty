import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/shared/firebase/admin';
import { createAuthenticatedClient } from '@/shared/supabase/server-client';

const DAILY_BONUS = 300;
const SIGNUP_BONUS = 1000;

async function ensureUser(supabase: ReturnType<typeof createAuthenticatedClient>, userId: string) {
  const { data: existing } = await supabase
    .from('user_points')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (existing) return false;

  const now = new Date().toISOString().split('T')[0];
  await supabase.from('user_points').insert({
    user_id: userId,
    balance: SIGNUP_BONUS + DAILY_BONUS,
    last_daily_claim_date: now,
  });

  await supabase.from('points_transactions').insert([
    { user_id: userId, amount: SIGNUP_BONUS, type: 'signup_bonus', description: 'Signup bonus' },
    { user_id: userId, amount: DAILY_BONUS, type: 'daily_bonus', description: 'Daily bonus' },
  ]);

  return true;
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing authorization' }, { status: 401 });
    }

    const decoded = await verifyFirebaseToken(authHeader.slice(7));
    const supabase = createAuthenticatedClient(decoded);

    const { data: points } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_id', decoded.uid)
      .maybeSingle();

    const balance = points?.balance ?? 0;

    const { data: transactions } = await supabase
      .from('points_transactions')
      .select('*')
      .eq('user_id', decoded.uid)
      .order('created_at', { ascending: false })
      .limit(50);

    return NextResponse.json({
      balance,
      canClaimDaily: !points || points.last_daily_claim_date !== new Date().toISOString().split('T')[0],
      transactions: transactions ?? [],
      chatCost: 50,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load points: ' + (error instanceof Error ? error.message : 'unknown') },
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

    const isNew = await ensureUser(supabase, decoded.uid);

    if (!isNew) {
      const today = new Date().toISOString().split('T')[0];

      const { data: points } = await supabase
        .from('user_points')
        .select('last_daily_claim_date')
        .eq('user_id', decoded.uid)
        .maybeSingle();

      if (points?.last_daily_claim_date === today) {
        return NextResponse.json({ error: 'Already claimed today' }, { status: 400 });
      }

      const { data: current } = await supabase
        .from('user_points')
        .select('balance')
        .eq('user_id', decoded.uid)
        .single();

      await supabase
        .from('user_points')
        .update({
          balance: (current?.balance ?? 0) + DAILY_BONUS,
          last_daily_claim_date: today,
        })
        .eq('user_id', decoded.uid);

      await supabase.from('points_transactions').insert({
        user_id: decoded.uid,
        amount: DAILY_BONUS,
        type: 'daily_bonus',
        description: 'Daily bonus',
      });
    }

    const { data: updated } = await supabase
      .from('user_points')
      .select('balance')
      .eq('user_id', decoded.uid)
      .single();

    return NextResponse.json({
      success: true,
      balance: updated?.balance ?? 0,
      isNew,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to claim points: ' + (error instanceof Error ? error.message : 'unknown') },
      { status: 500 }
    );
  }
}


