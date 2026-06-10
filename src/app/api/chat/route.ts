import {NextRequest, NextResponse} from 'next/server';
import {processMessage} from '@/shared/ai/chatAgent';
import type {ChatRequest, ChatResponse} from '@/shared/ai/types';
import {verifyFirebaseToken} from '@/shared/firebase/admin';
import {createAuthenticatedClient} from '@/shared/supabase/server-client';

const CHAT_COST = 50;

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json<ChatResponse>(
        {text: 'الرجاء تسجيل الدخول لاستخدام المساعد الذكي.'},
        {status: 401}
      );
    }

    const decoded = await verifyFirebaseToken(authHeader.slice(7));
    const supabase = createAuthenticatedClient(decoded);

    const {data: points, error: pointsError} = await supabase
      .from('user_points')
      .select('balance')
      .eq('user_id', decoded.uid)
      .maybeSingle();

    if (pointsError) {
      console.error('[chat] points lookup error:', pointsError.message);
      return NextResponse.json<ChatResponse>(
        {text: 'عذراً، حدث خطأ في التحقق من الرصيد.'},
        {status: 500}
      );
    }

    const balance = points?.balance ?? 0;

    if (balance < CHAT_COST) {
      return NextResponse.json<ChatResponse>(
        {
          text: `عذراً، رصيد النقاط غير كافٍ. لديك ${balance} نقطة وتحتاج ${CHAT_COST} نقطة لكل استفسار. يمكنك الحصول على نقاط يومية مجانية من صفحة النقاط.`
        },
        {status: 403}
      );
    }

    const body: ChatRequest = await request.json();
    const {message, history} = body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json<ChatResponse>(
        {text: 'الرجاء كتابة رسالة.'},
        {status: 400}
      );
    }

    const result = await processMessage(message, history || []);

    const newBalance = balance - CHAT_COST;

    const {error: updateError} = await supabase
      .from('user_points')
      .update({balance: newBalance})
      .eq('user_id', decoded.uid);

    if (updateError) {
      console.error('[chat] points update error:', updateError.message);
    }

    const {error: txError} = await supabase.from('points_transactions').insert({
      user_id: decoded.uid,
      amount: -CHAT_COST,
      type: 'chatbot_usage',
      description: `Chatbot query: "${message.slice(0, 60)}"`,
    });

    if (txError) {
      console.error('[chat] points tx error:', txError.message);
    }

    return NextResponse.json<ChatResponse>({
      ...result,
      balance: newBalance,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[chat]', message);

    if (message.includes('GOOGLE_GENERATIVE_AI_API_KEY')) {
      return NextResponse.json<ChatResponse>(
        {
          text: 'عذراً، لم يتم إعداد مفتاح الذكاء الاصطناعي بعد. يرجى التواصل مع الدعم الفني.'
        },
        {status: 500}
      );
    }

    if (message.includes('SAFETY') || message.includes('safety')) {
      return NextResponse.json<ChatResponse>(
        {
          text: 'عذراً، تعذر معالجة هذا الطلب بسبب قيود الأمان. يرجى إعادة صياغة سؤالك.'
        },
        {status: 400}
      );
    }

    return NextResponse.json<ChatResponse>(
      {
        text: `عذراً، حدث خطأ: ${message}`
      },
      {status: 500}
    );
  }
}
