'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'mr' | 'hi';

export interface Translations {
  [key: string]: {
    en: string;
    mr: string;
    hi: string;
  };
}

export const translations: Translations = {
  // Navigation & Shell
  'nav.overview': { en: 'Overview', mr: 'अहवाल / विहंगावलोकन', hi: 'अवलोकन' },
  'nav.produce': { en: 'Produce', mr: 'शेतमाल / उत्पादन', hi: 'उपज' },
  'nav.offers': { en: 'Offers', mr: 'प्रस्ताव', hi: 'ऑफर' },
  'nav.trades': { en: 'Trades', mr: 'व्यापार / खरेदी-विक्री', hi: 'व्यापार' },
  'nav.services': { en: 'Services', mr: 'सेवा', hi: 'सेवाएं' },
  'nav.mandi': { en: 'Mandi Intelligence', mr: 'बाजार भाव / मंडी', hi: 'मंडी भाव' },
  'nav.rankings': { en: 'Rankings', mr: 'क्रमवारी', hi: 'रैंकिंग' },
  'nav.geography': { en: 'Maharashtra Network Map', mr: 'महाराष्ट्र नकाशा', hi: 'महाराष्ट्र मानचित्र' },
  'nav.verification': { en: 'Verification', mr: 'सत्यापन', hi: 'सत्यापन' },
  'nav.documents': { en: 'Document Center', mr: 'कागदपत्रे / दस्तऐवज', hi: 'दस्तावेज़ केंद्र' },
  'nav.reset_demo': { en: 'Reset Demo', mr: 'डेमो रीसेट करा', hi: 'डेमो रीसेट करें' },

  // Role Names
  'role.farmer': { en: 'Farmer', mr: 'शेतकरी', hi: 'किसान' },
  'role.fpo': { en: 'FPO Organization', mr: 'शेतकरी उत्पादक कंपनी (FPO)', hi: 'किसान उत्पादक संगठन (FPO)' },
  'role.buyer': { en: 'Agri Buyer', mr: 'व्यापारी / खरेदीदार', hi: 'कृषि खरीदार' },
  'role.storage': { en: 'Storage Provider', mr: 'गोदाम / शीतगृह सेवा', hi: 'भंडारण प्रदाता' },
  'role.transport': { en: 'Transport Logistics', mr: 'वाहतूक / लॉजिस्टिक्स', hi: 'परिवहन सेवाएं' },
  'role.quality': { en: 'Quality Assessor', mr: 'गुणवत्ता तपासक', hi: 'गुणवत्ता परीक्षक' },
  'role.admin': { en: 'System Administrator', mr: 'सिस्टम प्रशासक', hi: 'सिस्टम प्रशासक' },

  // Header & Controls
  'header.viewing_as': { en: 'Viewing as', mr: 'भूमिका पहा', hi: 'के रूप में देख रहे हैं' },
  'header.language': { en: 'Language', mr: 'भाषा', hi: 'भाषा' },
  'header.search_placeholder': { en: 'Search produce, mandis and participants in Maharashtra...', mr: 'महाराष्ट्रातील शेतमाल, मंडी आणि सदस्य शोधा...', hi: 'महाराष्ट्र में उपज, मंडी और प्रतिभागी खोजें...' },
  'header.manage_account': { en: 'Account Settings', mr: 'खाते व्यवस्थापन', hi: 'खाता सेटिंग्स' },
  'header.update_role': { en: 'Change Role', mr: 'भूमिका बदला', hi: 'भूमिका बदलें' },

  // Chatbot & Voice
  'chat.title': { en: 'KisanMitra Voice & Data Assistant', mr: 'किसानमित्र व्हॉइस सहाय्यक', hi: 'किसानमित्र वॉयस असिस्टेंट' },
  'chat.subtitle': { en: 'Ask market prices or speak in Hindi/Marathi/English', mr: 'मंडी भाव विचारा किंवा मराठी/हिंदी/इंग्रजीमध्ये बोला', hi: 'मंडी भाव पूछें या हिंदी/मराठी/अंग्रेजी में बोलें' },
  'chat.placeholder': { en: 'Ask about mandi prices or speak using microphone...', mr: 'मंडी भावाबद्दल विचारा किंवा मायक्रोफोन वापरा...', hi: 'मंडी भाव के बारे में पूछें या माइक का उपयोग करें...' },
  'chat.mic_start': { en: 'Speak Now (Whisper Audio)', mr: 'आता बोला (व्हॉइस रेकॉर्डिंग)', hi: 'अब बोलें (वॉयस रिकॉर्डिंग)' },
  'chat.mic_stop': { en: 'Stop & Transcribe', mr: 'थांबवा आणि उत्तर मिळवा', hi: 'रोकें और उत्तर पाएं' },
  'chat.transcribing': { en: 'Processing Whisper Speech-to-Text...', mr: 'आवाज ट्रान्सक्राइब होत आहे...', hi: 'आवाज ट्रांसक्राइब हो रही है...' },

  // Geography & Maps
  'geo.title': { en: 'Maharashtra Participant Location Map', mr: 'महाराष्ट्र सहभागी नकाशा', hi: 'महाराष्ट्र प्रतिभागी मानचित्र' },
  'geo.subtitle': { en: 'Geographical distribution of Farmers, FPOs, Buyers, Storage & Transport in Maharashtra', mr: 'महाराष्ट्रातील शेतकरी, FPO, व्यापारी आणि लॉजिस्टिक्स नकाशा', hi: 'महाराष्ट्र में किसानों, FPO, खरीदारों और रसद का नक्शा' },
  'geo.default_location': { en: 'Default Location: Maharashtra, India', mr: 'मूलस्थान: महाराष्ट्र, भारत', hi: 'डिफ़ॉल्ट स्थान: महाराष्ट्र, भारत' },
  'geo.filter_district': { en: 'Filter District', mr: 'जिल्हा निवडा', hi: 'जिला चुनें' },
  'geo.filter_role': { en: 'Filter Role', mr: 'भूमिका निवडा', hi: 'भूमिका चुनें' },
  'geo.all_districts': { en: 'All Maharashtra Districts', mr: 'सर्व महाराष्ट्र जिल्हे', hi: 'सभी महाराष्ट्र जिले' },
  'geo.admin_note': { en: 'Admin profiles are management accounts and are excluded from public map markers.', mr: 'प्रशासक प्रोफाईल सार्वजनिक नकाशा चिन्हांमधून वगळले आहेत.', hi: 'प्रशासक प्रोफ़ाइल सार्वजनिक मानचित्र चिह्नों से बाहर हैं।' },

  // Documents
  'doc.title': { en: 'Document Support Services', mr: 'कागदपत्रे आणि दस्तऐवज सेवा', hi: 'दस्तावेज़ सहायता सेवाएं' },
  'doc.subtitle': { en: 'Upload and manage agricultural land records (7/12), licenses, certificates, and ID proof', mr: '७/१२ उतारा, परवाने, गुणवत्ता प्रमाणपत्रे आणि ओळखपत्रे व्यवस्थापित करा', hi: '7/12 भू-अभिलेख, लाइसेंस, प्रमाण पत्र और पहचान पत्र प्रबंधित करें' },
  'doc.upload_btn': { en: 'Upload Document', mr: 'कागदपत्र अपलोड करा', hi: 'दस्तावेज़ अपलोड करें' },
  'doc.select_type': { en: 'Document Category', mr: 'कागदपत्र प्रकार', hi: 'दस्तावेज़ श्रेणी' },
  'doc.land_record': { en: 'Land Record (7/12 Extract)', mr: '७/१२ सातबारा उतारा', hi: '7/12 भू-अभिलेख' },
  'doc.fpo_cert': { en: 'FPO Registration Certificate', mr: 'FPO नोंदणी प्रमाणपत्र', hi: 'FPO पंजीकरण प्रमाण पत्र' },
  'doc.trade_license': { en: 'Trade / Business License', mr: 'व्यापार परवाना', hi: 'व्यापार लाइसेंस' },
  'doc.id_proof': { en: 'Government ID Proof (Aadhaar/PAN)', mr: 'ओळखपत्र (आधार/पॅन)', hi: 'पहचान पत्र (आधार/पैन)' },
  'doc.quality_cert': { en: 'Quality & Organic Certification', mr: 'गुणवत्ता व सेंद्रिय प्रमाणपत्र', hi: 'गुणवत्ता प्रमाण पत्र' },
  'doc.warehouse_license': { en: 'Warehouse / Cold Storage License', mr: 'गोदाम / शीतगृह परवाना', hi: 'गोदाम / कोल्ड स्टोरेज लाइसेंस' },
  'doc.transport_permit': { en: 'Transport Permit & Vehicle RC', mr: 'वाहतूक परवाना आणि वाहन पास', hi: 'परिवहन परमिट और वाहन पास' },
  'doc.no_docs': { en: 'No documents uploaded yet. Upload your official certificates for instant profile verification.', mr: 'अद्याप कोणतेही कागदपत्र अपलोड केलेले नाही. सत्यापनासाठी तुमचे प्रमाणपत्र अपलोड करा.', hi: 'अभी तक कोई दस्तावेज़ अपलोड नहीं किया गया है। सत्यापन के लिए प्रमाण पत्र अपलोड करें।' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('kisanmitra_lang') as Language;
    if (saved && ['en', 'mr', 'hi'].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kisanmitra_lang', lang);
  };

  const t = (key: string): string => {
    const item = translations[key];
    if (!item) return key;
    return item[language] || item['en'] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
