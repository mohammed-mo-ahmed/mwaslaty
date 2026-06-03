import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: 'en' | 'ar';
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    home: 'Home',
    chatbot: 'ChatBot',
    search: 'Search',
    importantStops: 'Important Stops',
    userRoutes: 'User Routes',
    credits: 'Credits',
    
    // Home page
    navigateEgypt: 'Navigate Egypt with Ease',
    comprehensiveGuide: 'Your comprehensive guide to transportation across Egypt. Metro, buses, microbuses - all in one intelligent platform powered by community knowledge.',
    askChatBot: 'Ask the ChatBot',
    searchRoutes: 'Search Routes',
    aiChatBot: 'AI ChatBot',
    aiChatBotDesc: 'Ask in natural language: "I\'m in Nasr City, take me to 6th October"',
    manualSearch: 'Manual Search',
    manualSearchDesc: 'Search routes manually with map visualization',
    importantStopsDesc: 'Explore major hubs like Ramses, Aboud, and El-Monib',
    communityRoutes: 'Community Routes',
    communityRoutesDesc: 'Add new routes, vote, and help improve the network',
    transportationNetwork: 'Transportation Network',
    metroLines: 'Metro Lines',
    busRoutes: 'Bus Routes',
    microbusLines: 'Microbus Lines',
    majorStops: 'Major Stops',
    
    // ChatBot
    waslaAssistant: 'Wasla Assistant',
    askAnything: 'Ask me anything about getting around Egypt!',
    searching: 'Searching...',
    findRoutes: 'Find Routes',
    
    // Search
    routePlanner: 'Route Planner',
    planJourney: 'Plan your journey across Egypt with detailed step-by-step directions.',
    from: 'From',
    to: 'To',
    enterStarting: 'Enter starting location',
    enterDestination: 'Enter destination',
    routeMap: 'Route Map',
    routeOptions: 'Route Options',
    
    // Footer
    footerText: 'Connecting all of Egypt, one route at a time.',
  },
  ar: {
    // Navigation
    home: 'الرئيسية',
    chatbot: 'المساعد الذكي',
    search: 'البحث',
    importantStops: 'المحطات المهمة',
    userRoutes: 'طرق المستخدمين',
    credits: 'الرصيد',
    
    // Home page
    navigateEgypt: 'تنقل في مصر بسهولة',
    comprehensiveGuide: 'دليلك الشامل للمواصلات في مصر. مترو، أتوبيسات، ميكروباصات - كلها في منصة ذكية واحدة مدعومة بمعرفة المجتمع.',
    askChatBot: 'اسأل المساعد الذكي',
    searchRoutes: 'ابحث عن الطرق',
    aiChatBot: 'المساعد الذكي',
    aiChatBotDesc: 'اسأل بلغة طبيعية: "أنا في مدينة نصر وأريد الذهاب إلى مدينة 6 أكتوبر"',
    manualSearch: 'البحث اليدوي',
    manualSearchDesc: 'ابحث عن الطرق يدوياً مع عرض الخريطة',
    importantStopsDesc: 'استكشف المحاور الرئيسية مثل رمسيس وعبود والمنيب',
    communityRoutes: 'طرق المجتمع',
    communityRoutesDesc: 'أضف طرق جديدة، صوت، وساعد في تحسين الشبكة',
    transportationNetwork: 'شبكة المواصلات',
    metroLines: 'خطوط المترو',
    busRoutes: 'خطوط الأتوبيس',
    microbusLines: 'خطوط الميكروباص',
    majorStops: 'المحطات الرئيسية',
    
    // ChatBot
    waslaAssistant: 'مساعد وصلة',
    askAnything: 'اسألني أي شيء عن التنقل في مصر!',
    searching: 'جاري البحث...',
    findRoutes: 'ابحث عن الطرق',
    
    // Search
    routePlanner: 'مخطط الرحلات',
    planJourney: 'خطط رحلتك عبر مصر مع توجيهات مفصلة خطوة بخطوة.',
    from: 'من',
    to: 'إلى',
    enterStarting: 'أدخل نقطة البداية',
    enterDestination: 'أدخل الوجهة',
    routeMap: 'خريطة الطريق',
    routeOptions: 'خيارات الطرق',
    
    // Footer
    footerText: 'ربط كل مصر، طريق واحد في كل مرة.',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<'en' | 'ar'>('ar');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      <div className={language === 'ar' ? 'rtl' : 'ltr'} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}