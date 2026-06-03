import React, { useState } from 'react';
import { Send, MessageCircle, MapPin, Clock, DollarSign } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface RouteOption {
  id: string;
  duration: string;
  cost: string;
  steps: string[];
  transportModes: string[];
}

export default function ChatBot() {
  const { t } = useLanguage();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t('askAnything'),
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sampleRoutes: RouteOption[] = [
    {
      id: '1',
      duration: '1h 45m',
      cost: '15 EGP',
      steps: [
        'Walk to Nasr City Metro Station (5 min)',
        'Take Metro Line 3 to Attaba (25 min)',
        'Transfer to Metro Line 2 toward Giza (15 min)',
        'Exit at Giza Station',
        'Take Microbus #927 to 6th October (45 min)',
        'Walk to destination (10 min)'
      ],
      transportModes: ['Walk', 'Metro', 'Microbus'],
    },
    {
      id: '2',
      duration: '2h 15m',
      cost: '12 EGP',
      steps: [
        'Walk to Nasr City Bus Stop (8 min)',
        'Take Bus #174 to Ramses (35 min)',
        'Transfer to Bus #381 toward 6th October (1h 20 min)',
        'Walk to destination (12 min)'
      ],
      transportModes: ['Walk', 'Bus'],
    },
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I found several routes for you from Nasr City to 6th of October City:',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const isRouteQuery = messages.length > 2 && messages[messages.length - 2]?.isUser;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-amber-600 px-6 py-4">
          <div className="flex items-center">
            <MessageCircle className="h-6 w-6 text-white mr-2" />
            <h1 className="text-xl font-bold text-white">{t('waslaAssistant')}</h1>
          </div>
          <p className="text-blue-100 mt-1">{t('askAnything')}</p>
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs md:max-w-md px-4 py-3 rounded-lg ${
                  message.isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {/* Route Options */}
          {isRouteQuery && (
            <div className="space-y-4">
              {sampleRoutes.map((route) => (
                <div key={route.id} className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm">{route.duration}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span className="text-sm">{route.cost}</span>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      {route.transportModes.map((mode, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-amber-200 text-amber-800 text-xs rounded-full"
                        >
                          {mode}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {route.steps.map((step, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-sm text-gray-700">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me about routes... e.g., 'From Heliopolis to Downtown'"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Try asking: "From Maadi to New Cairo" or "Best route to Cairo Airport"
          </p>
        </div>
      </div>
    </div>
  );
}