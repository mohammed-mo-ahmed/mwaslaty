import React, { useState } from 'react';
import { Search as SearchIcon, MapPin, Clock, DollarSign, Navigation } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface RouteResult {
  id: string;
  duration: string;
  cost: string;
  distance: string;
  steps: Array<{
    instruction: string;
    mode: string;
    duration: string;
  }>;
}

export default function Search() {
  const { t } = useLanguage();

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [results, setResults] = useState<RouteResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!origin.trim() || !destination.trim()) return;

    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResults: RouteResult[] = [
        {
          id: '1',
          duration: '1h 30m',
          cost: '18 EGP',
          distance: '45 km',
          steps: [
            { instruction: 'Walk to nearest Metro station', mode: 'Walk', duration: '5 min' },
            { instruction: 'Take Metro Line 1 to Sadat', mode: 'Metro', duration: '25 min' },
            { instruction: 'Transfer to Metro Line 2', mode: 'Metro', duration: '5 min' },
            { instruction: 'Take Metro Line 2 to Giza', mode: 'Metro', duration: '20 min' },
            { instruction: 'Take Bus #381 to destination', mode: 'Bus', duration: '35 min' }
          ]
        },
        {
          id: '2',
          duration: '2h 15m',
          cost: '14 EGP',
          distance: '52 km',
          steps: [
            { instruction: 'Walk to bus stop', mode: 'Walk', duration: '8 min' },
            { instruction: 'Take Bus #174 to Ramses', mode: 'Bus', duration: '40 min' },
            { instruction: 'Transfer to Microbus #927', mode: 'Microbus', duration: '1h 15m' },
            { instruction: 'Walk to destination', mode: 'Walk', duration: '12 min' }
          ]
        }
      ];
      setResults(mockResults);
      setIsSearching(false);
    }, 2000);
  };

  const getModeColor = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'metro': return 'bg-blue-100 text-blue-800';
      case 'bus': return 'bg-green-100 text-green-800';
      case 'microbus': return 'bg-purple-100 text-purple-800';
      case 'walk': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('routePlanner')}</h1>
        <p className="text-gray-600">{t('planJourney')}</p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('from')}</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder={t('enterStarting')}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('to')}</label>
            <div className="relative">
              <Navigation className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder={t('enterDestination')}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
        
        <button
          onClick={handleSearch}
          disabled={isSearching || !origin.trim() || !destination.trim()}
          className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isSearching ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
          ) : (
            <SearchIcon className="h-5 w-5 mr-2" />
          )}
          {isSearching ? t('searching') : t('findRoutes')}
        </button>
      </div>

      {/* Map Placeholder */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('routeMap')}</h2>
        <div className="h-64 bg-gradient-to-br from-blue-100 to-amber-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Interactive map will display here</p>
            <p className="text-gray-400 text-sm">Showing routes between {origin || 'origin'} and {destination || 'destination'}</p>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('routeOptions')}</h2>
          {results.map((route) => (
            <div key={route.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Route {route.id}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{route.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span>{route.cost}</span>
                  </div>
                  <div className="text-gray-500">{route.distance}</div>
                </div>
              </div>
              
              <div className="space-y-3">
                {route.steps.map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-4">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">{step.instruction}</p>
                      <div className="flex items-center mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs mr-2 ${getModeColor(step.mode)}`}>
                          {step.mode}
                        </span>
                        <span className="text-gray-500 text-sm">{step.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && !isSearching && (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <SearchIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Plan Your Journey</h3>
          <p className="text-gray-600">Enter your starting point and destination to find the best routes across Egypt.</p>
        </div>
      )}
    </div>
  );
}