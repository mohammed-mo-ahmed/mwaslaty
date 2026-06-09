import {NextResponse} from 'next/server';
import {processMessage} from '@/shared/ai/chatAgent';
import type {ChatRequest, ChatResponse} from '@/shared/ai/types';

export async function POST(request: Request) {
  try {
    const body: ChatRequest = await request.json();
    const {message, history} = body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json<ChatResponse>(
        {text: 'الرجاء كتابة رسالة.'},
        {status: 400}
      );
    }

    const result = await processMessage(message, history || []);

    return NextResponse.json<ChatResponse>(result);
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
