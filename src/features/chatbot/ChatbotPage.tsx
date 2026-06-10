'use client';

import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Clock, DollarSign, MapPin, Send, Star} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {ServiceGate} from '@/shared/auth/ServiceGate';
import {useAuth} from '@/shared/auth/AuthProvider';
import MapView from '@/shared/components/MapView';
import type {RouteOption, PlaceResult} from '@/shared/ai/types';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  routes?: RouteOption[];
  places?: PlaceResult[];
};

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

function PlaceCard({place}: {place: PlaceResult}) {
  return (
    <div className="animate-fade-in-up my-2 flex items-start gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
        <MapPin className="h-4 w-4 text-emerald-600" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900">{place.name}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
          {place.rating ? (
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {place.rating}
            </span>
          ) : null}
          {place.distance ? <span>{place.distance}</span> : null}
          {place.address ? <span className="truncate">{place.address}</span> : null}
        </div>
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

  const handleSend = useCallback(async () => {
    const text = inputValue.trim();
    if (!isAuthenticated || !text || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    };

    const history = messages.map((msg) => ({
      role: msg.isUser ? 'user' as const : 'assistant' as const,
      text: msg.text,
      routes: msg.routes,
      places: msg.places
    }));

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message: text, history})
      });

      const data = await res.json();

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: data.text || 'عذراً، حدث خطأ. حاول مرة أخرى.',
        isUser: false,
        timestamp: new Date(),
        routes: data.routes,
        places: data.places
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: 'عذراً، حدث خطأ في الاتصال. تحقق من اتصالك بالإنترنت وحاول مرة أخرى.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isAuthenticated, isLoading, messages, t]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const showEmptyState = messages.length <= 1 && !isLoading;

  return (
    <div className="mx-auto flex max-w-5xl flex-1 flex-col overflow-hidden" style={{height: 'calc(100dvh - 4rem)'}}>

      <div className="flex-1 overflow-y-auto">
        {showEmptyState ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <h2 className="text-xl font-bold text-gray-900">{t('title')}</h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-500">
              {t('intro')}
            </p>
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
                      {msg.places?.map((place) => (
                        <PlaceCard key={place.id} place={place} />
                      ))}
                      {msg.places && msg.places.some(p => p.lat && p.lng) ? (
                        <div className="mt-3">
                          <MapView
                            height="h-48"
                            places={msg.places.filter(p => p.lat && p.lng).map(p => ({
                              id: p.id,
                              name: p.name,
                              nameAr: p.name,
                              lat: p.lat!,
                              lng: p.lng!,
                              type: 'place' as const,
                            }))}
                          />
                        </div>
                      ) : null}
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
