'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'en' | 'kn'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    appName: 'Bhoomi Mithra',
    tagline: 'ಬೆಳಕಿನ ಮನೆ',
    welcome: 'Welcome',
    dashboard: 'Command Center',
    weather: 'Weather Intelligence',
    crops: 'Crop Intelligence',
    cropDoctor: 'AI Crop Doctor',
    inputAdvisor: 'Input Advisor',
    calendar: 'Farm Calendar',
    profit: 'Profit Simulator',
    farmers: 'Find a Farmer',
    labor: 'Labor Marketplace',
    marketplace: 'Farm Marketplace',
    services: 'Agri Services',
    livestock: 'Livestock AI',
    business: 'Business Opportunities',
    askAI: 'Ask AI Copilot',
    acres: 'Acres',
    soil: 'Soil',
    water: 'Water',
    season: 'Season',
    crop: 'Primary Crop',
    location: 'Location',
    analyze: 'Analyze My Farm',
    bookWorker: 'Request Worker',
    logout: 'Logout',
    login: 'Sign In',
    register: 'Register',
    live: 'LIVE',
    aiGenerated: 'AI',
    verifiedD1: 'Cloudflare D1 Verified',
  },
  kn: {
    appName: 'ಭೂಮಿ ಮಿತ್ರ',
    tagline: 'ಬೆಳಕಿನ ಮನೆ',
    welcome: 'ಸ್ವಾಗತ',
    dashboard: 'ಮುಖ್ಯ ಪುಟ (ಕಮಾಂಡ್ ಸೆಂಟರ್)',
    weather: 'ಹವಾಮಾನ ಮಾಹಿತಿ',
    crops: 'ಬೆಳೆ ಮಾಹಿತಿ & ಶಿಫಾರಸು',
    cropDoctor: 'ಎಐ ಬೆಳೆ ವೈದ್ಯ',
    inputAdvisor: 'ಗೊಬ್ಬರ & ಪೋಷಕಾಂಶ ಸಲಹೆ',
    calendar: 'ಕೃಷಿ ಕ್ಯಾಲೆಂಡರ್',
    profit: 'ಲಾಭ ಸಿಮ್ಯುಲೇಟರ್',
    farmers: 'ರೈತರನ್ನು ಸಂಪರ್ಕಿಸಿ',
    labor: 'ಕೃಷಿ ಕೂಲಿ ಕಾರ್ಮಿಕರು',
    marketplace: 'ರೈತ ಮಾರುಕಟ್ಟೆ',
    services: 'ಕೃಷಿ ಸೇವೆಗಳು (ಡ್ರೋನ್/ಯಂತ್ರ)',
    livestock: 'ಪಶುಸಂಗೋಪನೆ ಎಐ',
    business: 'ವ್ಯಾಪಾರ ಅವಕಾಶಗಳು',
    askAI: 'ಭೂಮಿ ಮಿತ್ರ AI ಕೇಳಿ',
    acres: 'ಎಕರೆ',
    soil: 'ಮಣ್ಣು',
    water: 'ನೀರು',
    season: 'ಋತು',
    crop: 'ಮುಖ್ಯ ಬೆಳೆ',
    location: 'ಸ್ಥಳ',
    analyze: 'ನನ್ನ ಜಮೀನು ವಿಶ್ಲೇಷಿಸಿ',
    bookWorker: 'ಕಾರ್ಮಿಕರನ್ನು ಕಾಯ್ದಿರಿಸಿ',
    logout: 'ನಿರ್ಗಮಿಸಿ',
    login: 'ಲಾಗಿನ್',
    register: 'ನೋಂದಣಿ',
    live: 'ಲೈವ್',
    aiGenerated: 'ಎಐ',
    verifiedD1: 'D1 ಡೇಟಾಬೇಸ್',
  },
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('bhoomi_language') as Language
      if (saved === 'en' || saved === 'kn') {
        setLanguageState(saved)
      }
    } catch {}
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem('bhoomi_language', lang)
    } catch {}
  }

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
