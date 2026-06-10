import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/shared/firebase/admin';
import { createAuthenticatedClient } from '@/shared/supabase/server-client';

const DAILY_BONUS = 300;
const SIGNUP_BONUS = 1000;

async function ensureUser(supabase: ReturnType<typeof createAuthenticatedClient>, userId: string) {
  const { data: existing, error: lookupError } = await supabase
    .from('user_points')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (lookupError) {
    console.error('[points] lookup error:', lookupError.message);
    throw new Error(lookupError.message);
  }

  if (existing) return false;

  const now = new Date().toISOString().split('T')[0];

  const { error: insertError } = await supabase.from('user_points').insert({
    user_id: userId,
    balance: SIGNUP_BONUS + DAILY_BONUS,
    last_daily_claim_date: now,
  });

  if (insertError) {
    console.error('[points] insert user_points error:', insertError.message);
    throw new Error(insertError.message);
  }

  const { error: txError } = await supabase.from('points_transactions').insert([
    { user_id: userId, amount: SIGNUP_BONUS, type: 'signup_bonus', description: 'Signup bonus' },
    { user_id: userId, amount: DAILY_BONUS, type: 'daily_bonus', description: 'Daily bonus' },
  ]);

  if (txError) {
    console.error('[points] insert transactions error:', txError.message);
  }

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

    const { data: points, error: pointsError } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_id', decoded.uid)
      .maybeSingle();

    if (pointsError) {
      console.error('[points] GET user_points error:', pointsError.message);
      return NextResponse.json({ error: pointsError.message }, { status: 500 });
    }

    const balance = points?.balance ?? 0;

    const { data: transactions, error: txError } = await supabase
      .from('points_transactions')
      .select('*')
      .eq('user_id', decoded.uid)
      .order('created_at', { ascending: false })
      .limit(50);

    if (txError) {
      console.error('[points] GET transactions error:', txError.message);
    }

    return NextResponse.json({
      balance,
      canClaimDaily: !points || points.last_daily_claim_date !== new Date().toISOString().split('T')[0],
      transactions: transactions ?? [],
      chatCost: 50,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'unknown';
    console.error('[points] GET error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
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

      const { data: points, error: lookupError } = await supabase
        .from('user_points')
        .select('last_daily_claim_date, balance')
        .eq('user_id', decoded.uid)
        .maybeSingle();

      if (lookupError) {
        console.error('[points] POST lookup error:', lookupError.message);
        return NextResponse.json({ error: lookupError.message }, { status: 500 });
      }

      if (points?.last_daily_claim_date === today) {
        return NextResponse.json({ error: 'Already claimed today' }, { status: 400 });
      }

      const { error: updateError } = await supabase
        .from('user_points')
        .update({
          balance: (points?.balance ?? 0) + DAILY_BONUS,
          last_daily_claim_date: today,
        })
        .eq('user_id', decoded.uid);

      if (updateError) {
        console.error('[points] POST update error:', updateError.message);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      const { error: txError } = await supabase.from('points_transactions').insert({
        user_id: decoded.uid,
        amount: DAILY_BONUS,
        type: 'daily_bonus',
        description: 'Daily bonus',
      });

      if (txError) {
        console.error('[points] POST insert tx error:', txError.message);
      }
    }

    const { data: updated, error: fetchError } = await supabase
      .from('user_points')
      .select('balance')
      .eq('user_id', decoded.uid)
      .single();

    if (fetchError) {
      console.error('[points] POST fetch balance error:', fetchError.message);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      balance: updated?.balance ?? 0,
      isNew,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'unknown';
    console.error('[points] POST error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
