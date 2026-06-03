import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Search, MapPin, Users, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  const features = [
    {
      name: t('aiChatBot'),
      description: t('aiChatBotDesc'),
      icon: MessageCircle,
      href: '/chatbot',
      color: 'bg-blue-500',
    },
    {
      name: t('manualSearch'),
      description: t('manualSearchDesc'),
      icon: Search,
      href: '/search',
      color: 'bg-green-500',
    },
    {
      name: t('importantStops'),
      description: t('importantStopsDesc'),
      icon: MapPin,
      href: '/stops',
      color: 'bg-amber-500',
    },
    {
      name: t('communityRoutes'),
      description: t('communityRoutesDesc'),
      icon: Users,
      href: '/user-routes',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          {t('navigateEgypt').split(' ').map((word, index) => 
            word === 'Egypt' || word === 'مصر' ? (
              <span key={index} className="text-amber-600">{word} </span>
            ) : (
              <span key={index}>{word} </span>
            )
          )}
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          {t('comprehensiveGuide')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/chatbot"
            className="inline-flex items-center px-8 py-4 bg-amber-600 text-white font-semibold rounded-lg shadow-lg hover:bg-amber-700 transform hover:scale-105 transition-all duration-200"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            {t('askChatBot')}
          </Link>
          <Link
            to="/search"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
          >
            <Search className="mr-2 h-5 w-5" />
            {t('searchRoutes')}
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.name}
              to={feature.href}
              className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
              <div className="flex items-center text-amber-600 font-medium">
                <span>Explore</span>
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t('transportationNetwork')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
            <div className="text-gray-600">{t('metroLines')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
            <div className="text-gray-600">{t('busRoutes')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">1000+</div>
            <div className="text-gray-600">{t('microbusLines')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
            <div className="text-gray-600">{t('majorStops')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}