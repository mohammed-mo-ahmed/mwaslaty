import React, { useState } from 'react';
import { Coins, Gift, CreditCard, Users, Star, Check } from 'lucide-react';

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular?: boolean;
  bonus?: string;
}

export default function Credits() {
  const [currentCredits] = useState(5); // User starts with 5 free credits
  const [usageHistory] = useState([
    { action: 'Route Search', credits: -1, date: '2024-12-22' },
    { action: 'ChatBot Query', credits: -1, date: '2024-12-21' },
    { action: 'Welcome Bonus', credits: +5, date: '2024-12-20' },
  ]);

  const packages: CreditPackage[] = [
    {
      id: 'basic',
      name: 'Basic Pack',
      credits: 20,
      price: 10,
    },
    {
      id: 'standard',
      name: 'Standard Pack',
      credits: 50,
      price: 20,
      popular: true,
      bonus: '+5 bonus credits',
    },
    {
      id: 'premium',
      name: 'Premium Pack',
      credits: 100,
      price: 35,
      bonus: '+15 bonus credits',
    },
  ];

  const freeCreditsWays = [
    { action: 'Rate a route', reward: '1 credit' },
    { action: 'Submit a new route (approved)', reward: '5 credits' },
    { action: 'Share the app', reward: '2 credits' },
    { action: 'Weekly check-in', reward: '1 credit' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Credits & Billing</h1>
        <p className="text-gray-600">Manage your usage and purchase credits for unlimited access to transportation routes.</p>
      </div>

      {/* Current Balance */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-6 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Current Balance</h2>
            <div className="flex items-center">
              <Coins className="h-8 w-8 mr-2" />
              <span className="text-3xl font-bold">{currentCredits} Credits</span>
            </div>
            <p className="text-amber-100 mt-2">Each search or chatbot query uses 1 credit</p>
          </div>
          <div className="text-center">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <Gift className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Free Trial</p>
              <p className="text-xs opacity-80">First 3 searches free!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Packages */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Purchase Credits</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow ${
                pkg.popular ? 'ring-2 ring-amber-500 transform scale-105' : ''
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                <div className="text-3xl font-bold text-amber-600 mb-1">{pkg.credits}</div>
                <div className="text-gray-600 mb-4">Credits</div>
                
                {pkg.bonus && (
                  <div className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm mb-4">
                    {pkg.bonus}
                  </div>
                )}
                
                <div className="text-2xl font-bold text-gray-900 mb-6">{pkg.price} EGP</div>
                
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Purchase
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Earn Free Credits */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Gift className="h-5 w-5 mr-2 text-green-500" />
            Earn Free Credits
          </h2>
          <div className="space-y-3">
            {freeCreditsWays.map((way, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">{way.action}</span>
                <span className="font-semibold text-green-600">{way.reward}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Usage History */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {usageHistory.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="text-gray-700">{item.action}</p>
                  <p className="text-gray-500 text-sm">{item.date}</p>
                </div>
                <span className={`font-semibold ${item.credits > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.credits > 0 ? '+' : ''}{item.credits} credits
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}