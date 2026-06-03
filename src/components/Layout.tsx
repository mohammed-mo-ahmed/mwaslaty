import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MapPin, MessageCircle, Search, Users, Coins, Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();

  const navigation = [
    { name: t('home'), href: '/', icon: MapPin },
    { name: t('chatbot'), href: '/chatbot', icon: MessageCircle },
    { name: t('search'), href: '/search', icon: Search },
    { name: t('importantStops'), href: '/stops', icon: MapPin },
    { name: t('userRoutes'), href: '/user-routes', icon: Users },
    { name: t('credits'), href: '/credits', icon: Coins },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <MapPin className="h-8 w-8 text-amber-600" />
                <span className="text-xl font-bold text-gray-900">Wasla</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'bg-amber-100 text-amber-800'
                        : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-amber-600 hover:bg-amber-50 transition-colors"
              >
                <Languages className="h-4 w-4" />
                <span>{language === 'en' ? 'العربية' : 'English'}</span>
              </button>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-amber-600 hover:bg-amber-50"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-amber-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'bg-amber-100 text-amber-800'
                        : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Language Toggle */}
              <button
                onClick={() => {
                  toggleLanguage();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-amber-600 hover:bg-amber-50 transition-colors"
              >
                <Languages className="h-5 w-5" />
                <span>{language === 'en' ? 'العربية' : 'English'}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-amber-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 Wasla. {t('footerText')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}