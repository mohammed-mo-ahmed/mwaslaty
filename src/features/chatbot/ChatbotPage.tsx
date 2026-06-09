'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {ArrowRight, Clock, DollarSign, MapPin, Send, Sparkles} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {ServiceGate} from '@/shared/auth/ServiceGate';
import {useAuth} from '@/shared/auth/AuthProvider';

type RouteStep = {
  instruction: string;
  duration: string;
  icon?: string;
};

type RouteOption = {
  id: string;
  duration: string;
  cost: string;
  transfers: number;
  steps: RouteStep[];
  modes: string[];
};

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  routes?: RouteOption[];
};

const sampleRoutes: RouteOption[] = [
  {
    id: '1',
    duration: '1h 45m',
    cost: '15 EGP',
    transfers: 2,
    modes: ['walk', 'metro', 'microbus'],
    steps: [
      {instruction: 'Walk to Nasr City Metro Station', duration: '5 min', icon: 'walk'},
      {instruction: 'Take Metro Line 3 to Attaba', duration: '25 min', icon: 'metro'},
      {instruction: 'Transfer to Metro Line 2 toward Giza', duration: '5 min', icon: 'transfer'},
      {instruction: 'Take Microbus #927 to 6th October', duration: '45 min', icon: 'microbus'}
    ]
  },
  {
    id: '2',
    duration: '2h 15m',
    cost: '12 EGP',
    transfers: 1,
    modes: ['walk', 'bus'],
    steps: [
      {instruction: 'Walk to Nasr City Bus Stop', duration: '8 min', icon: 'walk'},
      {instruction: 'Take Bus #174 to Ramses', duration: '35 min', icon: 'bus'},
      {instruction: 'Transfer to Bus #381 toward 6th October', duration: '1h 20m', icon: 'transfer'}
    ]
  }
];

function TypingIndicator() {
  return (
    <div className="flex justify-start px-4 py-1">
      <div className="flex items-center gap-3 rounded-2xl bg-gray-100 px-5 py-4">
        <div className="flex items-center gap-1">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </div>
  );
}

function RouteCard({route, t, tCommon}: {route: RouteOption; t: ReturnType<typeof useTranslations>; tCommon: ReturnType<typeof useTranslations>}) {
  return (
    <div className="animate-fade-in-up my-3 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-amber-50 to-white px-5 py-3">
        <span className="text-sm font-semibold text-gray-900">
          {t('routeOption')} {route.id}
        </span>
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-amber-600" />
            {route.duration}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
            {route.cost}
          </span>
        </div>
      </div>
      <div className="px-5 py-4">
        <div className="relative">
          {route.steps.map((step, index) => (
            <div key={index} className="relative flex gap-4 pb-5 last:pb-0">
              {index < route.steps.length - 1 ? (
                <div className="absolute bottom-5 left-[13px] top-5 w-0.5 bg-amber-200" />
              ) : null}
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                {index + 1}
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-sm text-gray-800">{step.instruction}</p>
                <p className="mt-0.5 text-xs text-gray-500">{step.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 px-5 py-3">
        <span className="text-xs text-gray-500">{t('transfers')}: {route.transfers}</span>
        <span className="text-gray-300">|</span>
        {route.modes.map((mode) => (
          <span key={mode} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
            {tCommon(mode)}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ChatbotPage() {
  const t = useTranslations('chatbot');
  const tCommon = useTranslations('common');
  const {isAuthenticated} = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {id: '1', text: t('intro'), isUser: false, timestamp: new Date()}
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({behavior: 'smooth'});
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  }, [inputValue]);

  const handleSend = useCallback(() => {
    const text = inputValue.trim();
    if (!isAuthenticated || !text || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: t('response'),
        isUser: false,
        timestamp: new Date(),
        routes: sampleRoutes
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsLoading(false);
    }, 1200);
  }, [inputValue, isAuthenticated, isLoading, t]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const showEmptyState = messages.length <= 1 && !isLoading;

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-5xl flex-col">
      <div className="flex items-center justify-center border-b border-gray-200/80 bg-white/60 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-sm">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900">{t('title')}</h1>
            <p className="text-xs text-gray-500">{t('subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {showEmptyState ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-200/50">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{t('title')}</h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-500">
              {t('intro')}
            </p>
            <div className="mt-8 grid w-full max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                'From Maadi to New Cairo',
                'Best route to Cairo Airport',
                'From Heliopolis to Downtown',
                'Metro from Giza to Ramses'
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setInputValue(suggestion);
                    textareaRef.current?.focus();
                  }}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-xs text-gray-600 shadow-sm transition hover:border-amber-300 hover:shadow-md"
                >
                  <MapPin className="me-1.5 inline h-3.5 w-3.5 text-amber-500" />
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl px-6 py-6">
            {messages.map((msg) => (
              <div key={msg.id} className="animate-fade-in-up">
                {msg.isUser ? (
                  <div className="flex justify-end px-4 py-1">
                    <div className="max-w-[75%] rounded-2xl bg-blue-600 px-5 py-3 shadow-sm">
                      <p className="text-sm leading-relaxed text-white whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-1">
                    <div className="max-w-[85%]">
                      <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">{msg.text}</p>
                      {msg.routes?.map((route) => (
                        <RouteCard key={route.id} route={route} t={t} tCommon={tCommon} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading ? <TypingIndicator /> : null}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      <div className="border-t border-gray-200/80 bg-white/60 backdrop-blur-md">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <ServiceGate>
            <div className="flex items-end gap-3 rounded-2xl border border-gray-200/80 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-md transition focus-within:border-amber-300 focus-within:shadow-md">
              <textarea
                ref={textareaRef}
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('placeholder')}
                disabled={isLoading}
                className="max-h-40 flex-1 resize-none bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={isLoading || !inputValue.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </ServiceGate>
        </div>
      </div>
    </div>
  );
}
