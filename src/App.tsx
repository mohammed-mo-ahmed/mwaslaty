import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import ChatBot from './pages/ChatBot';
import Search from './pages/Search';
import ImportantStops from './pages/ImportantStops';
import StopDetails from './pages/StopDetails';
import UserRoutes from './pages/UserRoutes';
import Credits from './pages/Credits';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chatbot" element={<ChatBot />} />
            <Route path="/search" element={<Search />} />
            <Route path="/stops" element={<ImportantStops />} />
            <Route path="/stops/:stopId" element={<StopDetails />} />
            <Route path="/user-routes" element={<UserRoutes />} />
            <Route path="/credits" element={<Credits />} />
          </Routes>
        </Layout>
      </Router>
    </LanguageProvider>
  );
}

export default App;