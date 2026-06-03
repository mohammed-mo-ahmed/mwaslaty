import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Train, Bus, Clock, DollarSign, Users, Star } from 'lucide-react';

interface Route {
  id: string;
  name: string;
  type: 'Metro' | 'Bus' | 'Microbus';
  destination: string;
  fare: string;
  frequency: string;
  rating: number;
  operatingHours: string;
}

export default function StopDetails() {
  const { stopId } = useParams();
  const [activeTab, setActiveTab] = useState<'routes' | 'info'>('routes');

  // Mock data based on stop ID
  const stopInfo = {
    ramses: {
      name: 'Ramses Station',
      nameAr: 'محطة رمسيس',
      description: 'Major railway and metro hub connecting Cairo with rest of Egypt. This historic station serves as a central point for both local and long-distance travel.',
      facilities: ['ATM', 'Restaurants', 'Waiting Areas', 'Ticket Office', 'Parking'],
      imageUrl: 'https://images.pexels.com/photos/2935687/pexels-photo-2935687.jpeg',
    }
  };

  const routes: Route[] = [
    {
      id: '1',
      name: 'Metro Line 2 - Shobra',
      type: 'Metro',
      destination: 'El-Monib',
      fare: '6 EGP',
      frequency: '5-8 min',
      rating: 4.2,
      operatingHours: '5:30 AM - 12:00 AM',
    },
    {
      id: '2',
      name: 'Bus #74',
      type: 'Bus',
      destination: 'Heliopolis',
      fare: '3 EGP',
      frequency: '10-15 min',
      rating: 3.8,
      operatingHours: '6:00 AM - 11:00 PM',
    },
    {
      id: '3',
      name: 'Microbus #127',
      type: 'Microbus',
      destination: 'Nasr City',
      fare: '5 EGP',
      frequency: '5-10 min',
      rating: 4.0,
      operatingHours: '5:00 AM - 1:00 AM',
    },
    {
      id: '4',
      name: 'Express Bus #905',
      type: 'Bus',
      destination: 'New Administrative Capital',
      fare: '15 EGP',
      frequency: '30 min',
      rating: 4.5,
      operatingHours: '6:00 AM - 10:00 PM',
    },
  ];

  const currentStop = stopInfo[stopId as keyof typeof stopInfo] || stopInfo.ramses;

  const getRouteColor = (type: string) => {
    switch (type) {
      case 'Metro': return 'bg-blue-500 text-white';
      case 'Bus': return 'bg-green-500 text-white';
      case 'Microbus': return 'bg-purple-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getRouteIcon = (type: string) => {
    switch (type) {
      case 'Metro': return Train;
      case 'Bus': return Bus;
      case 'Microbus': return Bus;
      default: return Bus;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        to="/stops"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to All Stops
      </Link>

      {/* Hero Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="relative h-64">
          <img
            src={currentStop.imageUrl}
            alt={currentStop.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{currentStop.name}</h1>
            <p className="text-xl opacity-90">{currentStop.nameAr}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('routes')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'routes'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Routes & Schedules
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'info'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Station Info
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'routes' && (
            <div className="space-y-4">
              {routes.map((route) => {
                const Icon = getRouteIcon(route.type);
                return (
                  <div
                    key={route.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getRouteColor(route.type)}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{route.name}</h3>
                          <p className="text-gray-600">to {route.destination}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm">{route.rating}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span>{route.fare}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{route.frequency}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{route.operatingHours}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'info' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Stop</h3>
                <p className="text-gray-600">{currentStop.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Facilities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {currentStop.facilities.map((facility, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-amber-50 rounded-lg"
                    >
                      <MapPin className="h-4 w-4 text-amber-600 mr-2" />
                      <span className="text-gray-700">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Getting Here</h4>
                <p className="text-blue-700 text-sm">
                  This stop is accessible via multiple transportation modes. Check the Routes tab for detailed information about all available connections.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}