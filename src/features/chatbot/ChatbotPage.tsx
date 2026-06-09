'use client';

import {useState} from 'react';
import {Clock, DollarSign, MessageCircle, Send} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {ServiceGate} from '@/shared/auth/ServiceGate';
import {useAuth} from '@/shared/auth/AuthProvider';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

const sampleRoutes = [
  {
    id: '1',
    duration: '1h 45m',
    cost: '15 EGP',
    steps: [
      'Walk to Nasr City Metro Station (5 min)',
      'Take Metro Line 3 to Attaba (25 min)',
      'Transfer to Metro Line 2 toward Giza (15 min)',
      'Take Microbus #927 to 6th October (45 min)'
    ],
    modes: ['walk', 'metro', 'microbus']
  },
  {
    id: '2',
    duration: '2h 15m',
    cost: '12 EGP',
    steps: [
      'Walk to Nasr City Bus Stop (8 min)',
      'Take Bus #174 to Ramses (35 min)',
      'Transfer to Bus #381 toward 6th October (1h 20m)'
    ],
    modes: ['walk', 'bus']
  }
];

export function ChatbotPage() {
  const t = useTranslations('chatbot');
  const tCommon = useTranslations('common');
  const {isAuthenticated} = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {id: '1', text: t('intro'), isUser: false, timestamp: new Date()}
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const hasRouteResponse = messages.length > 2;

  const handleSendMessage = () => {
    if (!isAuthenticated || !inputMessage.trim()) return;
    setMessages((current) => [
      ...current,
      {id: Date.now().toString(), text: inputMessage, isUser: true, timestamp: new Date()}
    ]);
    setInputMessage('');
    setIsLoading(true);
    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {id: `${Date.now()}-bot`, text: t('response'), isUser: false, timestamp: new Date()}
      ]);
      setIsLoading(false);
    }, 700);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-amber-600 px-6 py-5">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-white" />
            <h1 className="text-xl font-bold text-white">{t('title')}</h1>
          </div>
          <p className="mt-1 text-blue-50">{t('subtitle')}</p>
        </div>

        <div className="h-96 overflow-y-auto p-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md rounded-lg px-4 py-3 ${
                    message.isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="mt-1 text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {hasRouteResponse ? (
              <div className="space-y-4">
                {sampleRoutes.map((route) => (
                  <div
                    key={route.id}
                    className="rounded-lg border border-amber-200 bg-amber-50 p-4"
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Clock className="me-1 h-4 w-4" />
                          {route.duration}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="me-1 h-4 w-4" />
                          {route.cost}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {route.modes.map((mode) => (
                          <span
                            key={mode}
                            className="rounded-full bg-amber-200 px-2 py-1 text-xs text-amber-900"
                          >
                            {tCommon(mode)}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {route.steps.map((step, index) => (
                        <div key={step} className="flex items-start gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                            {index + 1}
                          </span>
                          <p className="text-sm text-gray-700">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {isLoading ? (
              <div className="rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-600">...</div>
            ) : null}
          </div>
        </div>

        <div className="border-t border-gray-200 p-4">
          <ServiceGate>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder={t('placeholder')}
                disabled={isLoading}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">{t('hint')}</p>
          </ServiceGate>
        </div>
      </div>
    </div>
  );
}
