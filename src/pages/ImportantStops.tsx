import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Train, Bus, ArrowRight } from 'lucide-react';

interface Stop {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  connections: string[];
  imageUrl: string;
  routes: number;
  isMetroStation: boolean;
}

export default function ImportantStops() {
  const importantStops: Stop[] = [
    {
      id: 'ramses',
      name: 'Ramses Station',
      nameAr: 'محطة رمسيس',
      description: 'Major railway and metro hub connecting Cairo with rest of Egypt',
      connections: ['Metro Line 2', 'National Railway', '50+ Bus Lines'],
      imageUrl: 'https://images.pexels.com/photos/2935687/pexels-photo-2935687.jpeg',
      routes: 75,
      isMetroStation: true,
    },
    {
      id: 'tahrir',
      name: 'Tahrir Square',
      nameAr: 'ميدان التحرير',
      description: 'Historic central square with extensive bus and microbus networks',
      connections: ['Metro Line 2', '30+ Bus Lines', '20+ Microbus Lines'],
      imageUrl: 'https://images.pexels.com/photos/2363807/pexels-photo-2363807.jpeg',
      routes: 65,
      isMetroStation: true,
    },
    {
      id: 'aboud',
      name: 'Aboud',
      nameAr: 'عبود',
      description: 'Key transportation junction in Giza connecting to western regions',
      connections: ['15+ Bus Lines', '25+ Microbus Lines'],
      imageUrl: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg',
      routes: 45,
      isMetroStation: false,
    },
    {
      id: 'el-monib',
      name: 'El-Monib',
      nameAr: 'المنيب',
      description: 'Southern terminus of Metro Line 2 with extensive Giza connections',
      connections: ['Metro Line 2', '20+ Bus Lines', '15+ Microbus Lines'],
      imageUrl: 'https://images.pexels.com/photos/2363807/pexels-photo-2363807.jpeg',
      routes: 55,
      isMetroStation: true,
    },
    {
      id: 'new-cairo',
      name: 'New Cairo Hub',
      nameAr: 'القاهرة الجديدة',
      description: 'Modern transportation center serving New Cairo developments',
      connections: ['Metro Line 3', '25+ Bus Lines', 'Airport Connection'],
      imageUrl: 'https://images.pexels.com/photos/2935687/pexels-photo-2935687.jpeg',
      routes: 40,
      isMetroStation: true,
    },
    {
      id: 'heliopolis',
      name: 'Heliopolis Square',
      nameAr: 'ميدان هليوبوليس',
      description: 'Eastern Cairo hub with connections to airport and New Cairo',
      connections: ['Metro Line 3', '18+ Bus Lines', '12+ Microbus Lines'],
      imageUrl: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg',
      routes: 38,
      isMetroStation: true,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Important Transportation Stops</h1>
        <p className="text-gray-600">Explore Egypt's major transportation hubs with detailed route information and connections.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {importantStops.map((stop) => (
          <Link
            key={stop.id}
            to={`/stops/${stop.id}`}
            className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            {/* Image Header */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={stop.imageUrl}
                alt={stop.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">{stop.name}</h3>
                <p className="text-sm opacity-90">{stop.nameAr}</p>
              </div>
              {stop.isMetroStation && (
                <div className="absolute top-4 right-4">
                  <Train className="h-6 w-6 text-white bg-blue-600 p-1 rounded" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-600 text-sm mb-4">{stop.description}</p>
              
              {/* Stats */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-amber-600">
                  <Bus className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">{stop.routes} Routes</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
              </div>

              {/* Connections */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Transportation Types</h4>
                <div className="flex flex-wrap gap-1">
                  {stop.connections.map((connection, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full"
                    >
                      {connection}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-12 bg-gradient-to-r from-blue-600 to-amber-600 rounded-xl p-8 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Can't Find Your Stop?</h2>
          <p className="mb-6">Help us improve the network by adding missing stops or routes.</p>
          <Link
            to="/user-routes"
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            <MapPin className="mr-2 h-5 w-5" />
            Add New Route
          </Link>
        </div>
      </div>
    </div>
  );
}