import React, { useState } from 'react';
import { Plus, ThumbsUp, ThumbsDown, MapPin, Clock, DollarSign, User, X } from 'lucide-react';

interface UserRoute {
  id: string;
  name: string;
  origin: string;
  destination: string;
  fare: string;
  duration: string;
  type: 'Metro' | 'Bus' | 'Microbus';
  submittedBy: string;
  votes: { up: number; down: number };
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
}

export default function UserRoutes() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'submitted' | 'add'>('submitted');
  const [newRoute, setNewRoute] = useState({
    name: '',
    origin: '',
    destination: '',
    fare: '',
    duration: '',
    type: 'Bus' as const,
  });

  const userRoutes: UserRoute[] = [
    {
      id: '1',
      name: 'Express Microbus - New Cairo to Downtown',
      origin: 'New Cairo',
      destination: 'Downtown Cairo',
      fare: '12 EGP',
      duration: '45 min',
      type: 'Microbus',
      submittedBy: 'Ahmed M.',
      votes: { up: 24, down: 3 },
      status: 'approved',
      submittedAt: new Date('2024-12-15'),
    },
    {
      id: '2',
      name: 'Night Bus - Maadi to Airport',
      origin: 'Maadi',
      destination: 'Cairo Airport',
      fare: '25 EGP',
      duration: '1h 15m',
      type: 'Bus',
      submittedBy: 'Sara K.',
      votes: { up: 18, down: 2 },
      status: 'pending',
      submittedAt: new Date('2024-12-20'),
    },
    {
      id: '3',
      name: 'Alternative Route - Zamalek via Qasr El-Nil',
      origin: 'Zamalek',
      destination: 'Tahrir Square',
      fare: '4 EGP',
      duration: '20 min',
      type: 'Microbus',
      submittedBy: 'Mohamed A.',
      votes: { up: 8, down: 12 },
      status: 'rejected',
      submittedAt: new Date('2024-12-18'),
    },
  ];

  const handleSubmitRoute = () => {
    // Here you would typically submit to your backend
    console.log('Submitting route:', newRoute);
    setNewRoute({
      name: '',
      origin: '',
      destination: '',
      fare: '',
      duration: '',
      type: 'Bus',
    });
    setShowAddForm(false);
  };

  const handleVote = (routeId: string, voteType: 'up' | 'down') => {
    console.log(`Voting ${voteType} for route ${routeId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Metro': return 'bg-blue-500';
      case 'Bus': return 'bg-green-500';
      case 'Microbus': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Routes</h1>
          <p className="text-gray-600">Help improve Egypt's transportation network by sharing routes and voting on submissions.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transform hover:scale-105 transition-all"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Route
        </button>
      </div>

      {/* Add Route Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add New Route</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Route Name</label>
                <input
                  type="text"
                  value={newRoute.name}
                  onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                  placeholder="e.g., Express Bus - Maadi to New Cairo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <input
                    type="text"
                    value={newRoute.origin}
                    onChange={(e) => setNewRoute({ ...newRoute, origin: e.target.value })}
                    placeholder="Starting point"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <input
                    type="text"
                    value={newRoute.destination}
                    onChange={(e) => setNewRoute({ ...newRoute, destination: e.target.value })}
                    placeholder="Destination"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newRoute.type}
                    onChange={(e) => setNewRoute({ ...newRoute, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Bus">Bus</option>
                    <option value="Microbus">Microbus</option>
                    <option value="Metro">Metro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fare</label>
                  <input
                    type="text"
                    value={newRoute.fare}
                    onChange={(e) => setNewRoute({ ...newRoute, fare: e.target.value })}
                    placeholder="e.g., 8 EGP"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={newRoute.duration}
                    onChange={(e) => setNewRoute({ ...newRoute, duration: e.target.value })}
                    placeholder="e.g., 30 min"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRoute}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Route
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Routes List */}
      <div className="space-y-4">
        {userRoutes.map((route) => (
          <div key={route.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`px-2 py-1 rounded-full text-white text-xs ${getTypeColor(route.type)}`}>
                    {route.type}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs capitalize ${getStatusColor(route.status)}`}>
                    {route.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{route.name}</h3>
                <p className="text-gray-600 text-sm">{route.origin} → {route.destination}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
              <div className="flex items-center text-gray-600">
                <DollarSign className="h-4 w-4 mr-1" />
                <span>{route.fare}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                <span>{route.duration}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <User className="h-4 w-4 mr-1" />
                <span>{route.submittedBy}</span>
              </div>
              <div className="text-gray-500">
                {route.submittedAt.toLocaleDateString()}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleVote(route.id, 'up')}
                  className="flex items-center space-x-1 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{route.votes.up}</span>
                </button>
                <button
                  onClick={() => handleVote(route.id, 'down')}
                  className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <ThumbsDown className="h-4 w-4" />
                  <span>{route.votes.down}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}