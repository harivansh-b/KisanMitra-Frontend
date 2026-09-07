'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'mr';

export interface Translations {
  [key: string]: {
    en: string;
    mr: string;
  };
}

export const translations: Translations = {
  // Navigation & Shell
  'nav.overview': { en: 'Overview', mr: 'विहंगावलोकन / डॅशबोर्ड' },
  'nav.produce': { en: 'Produce', mr: 'शेतमाल / पिके' },
  'nav.offers': { en: 'Offers', mr: 'व्यापार प्रस्ताव' },
  'nav.trades': { en: 'Trades', mr: 'खरेदी-विक्री व्यवहार' },
  'nav.services': { en: 'Services', mr: 'कृषी सेवा' },
  'nav.mandi': { en: 'Mandi Intelligence', mr: 'मंडी बाजार भाव' },
  'nav.rankings': { en: 'Rankings', mr: 'बाजार क्रमवारी' },
  'nav.geography': { en: 'Maharashtra Network Map', mr: 'महाराष्ट्र नकाशा' },
  'nav.verification': { en: 'Verification', mr: 'प्रोफाईल सत्यापन (KYC)' },
  'nav.documents': { en: 'Document Center', mr: 'कागदपत्रे व दस्तऐवज' },
  'nav.reset_demo': { en: 'Reset Demo', mr: 'डेमो रीसेट करा' },

  // Role Names (Updated exact role names for DB & UI)
  'role.farmer': { en: 'Farmer', mr: 'शेतकरी' },
  'role.fpo': { en: 'FPO Organization', mr: 'शेतकरी उत्पादक कंपनी (FPO)' },
  'role.buyer': { en: 'Agri Buyer', mr: 'व्यापारी / खरेदीदार' },
  'role.storage': { en: 'Storage Manager', mr: 'गोदाम व्यवस्थापक (Storage Manager)' },
  'role.transport': { en: 'Transport Logistics', mr: 'वाहतूक व्यवस्थापक (Transport Logistics)' },
  'role.quality': { en: 'Quality Assessor', mr: 'गुणवत्ता तपासक (Quality Assessor)' },
  'role.admin': { en: 'System Administrator', mr: 'सिस्टम प्रशासक (Admin)' },

  // Header & Controls
  'header.viewing_as': { en: 'Viewing as', mr: 'भूमिका निवडा' },
  'header.language': { en: 'Language', mr: 'भाषा' },
  'header.search_placeholder': { en: 'Search produce, mandis and participants in Maharashtra...', mr: 'महाराष्ट्रातील शेतमाल, मंडी आणि सदस्य शोधा...' },
  'header.manage_account': { en: 'Account Settings', mr: 'खाते व्यवस्थापन' },
  'header.update_role': { en: 'Change Role', mr: 'भूमिका बदला' },
  'header.demo_mode': { en: 'Demo Switcher Active', mr: 'डेमो मोड सक्रिय' },
  'header.authenticated': { en: 'Authenticated Profile', mr: 'प्रमाणित प्रोफाईल' },

  // Listings & Controls (Show More / Limits)
  'listing.show_more': { en: 'Show More Items', mr: 'आणखी पहा' },
  'listing.show_less': { en: 'Show Less', mr: 'कमी करा' },
  'listing.showing_limit': { en: 'Showing {current} of {total} listings', mr: 'एकूण {total} पैकी {current} दाखवत आहे' },
  'listing.items_per_page': { en: 'Items per page', mr: 'प्रति पृष्ठ वस्तू' },
  'listing.no_results': { en: 'No listings found matching your search.', mr: 'तुमच्या शोधानुसार कोणतेही निकाल सापडले नाहीत.' },
  'listing.all': { en: 'All Items', mr: 'सर्व निकाल' },

  // Mandi & Stock UI
  'mandi.ticker_title': { en: 'Maharashtra Live Mandi Stock Ticker', mr: 'महाराष्ट्र लाईव्ह मंडी स्टॉक टिकर' },
  'mandi.ticker_updated': { en: 'Updated live from AgMarknet', mr: 'AgMarknet कडून थेट अद्यतनित' },
  'mandi.title': { en: 'Stock Market Pricing Board', mr: 'बाजार भाव आणि स्टॉक बोर्ड' },
  'mandi.subtitle': { en: 'Real-time agricultural commodity pricing, arrival volumes, and price ranges across Maharashtra Mandis.', mr: 'महाराष्ट्रातील मंड्यांमधील थेट शेतमाल भाव, आवक आणि किमतींची श्रेणी.' },
  'mandi.refresh': { en: 'Refresh Ticker', mr: 'ताजे करा' },
  'mandi.demo_notice': { en: 'Prices marked AGMARKNET-DEMO represent realistic historical Maharashtra mandi trends.', mr: 'AGMARKNET-DEMO चिन्हित भाव महाराष्ट्रातील वास्तववादी मंडी ट्रेंड दर्शवतात.' },
  'mandi.filter_title': { en: 'Filter Commodity Stock Board', mr: 'शेतमाल स्टॉक बोर्ड फिल्टर करा' },
  'mandi.all_produce': { en: 'All Produce', mr: 'सर्व शेतमाल' },
  'mandi.top_gainers': { en: 'Top Gainers 📈', mr: 'सर्वाधिक वाढ 📈' },
  'mandi.top_losers': { en: 'Top Losers 📉', mr: 'सर्वाधिक घसरण 📉' },
  'mandi.col_commodity': { en: 'Commodity', mr: 'शेतमाल' },
  'mandi.col_mandi': { en: 'Mandi / Market', mr: 'मंडी / बाजार' },
  'mandi.col_district': { en: 'District', mr: 'जिल्हा' },
  'mandi.col_price': { en: 'Modal Price', mr: 'सरासरी भाव (₹/क्विंटल)' },
  'mandi.col_trend': { en: '24h Trend', mr: '२४ तास कल' },
  'mandi.col_range': { en: 'Day Price Range (Min - Max)', mr: 'दिवसाची भाव मर्यादा (किमान - कमाल)' },
  'mandi.col_date': { en: 'Arrival Date', mr: 'आवक दिनांक' },
  'mandi.directory_title': { en: 'Maharashtra Mandi Directory List', mr: 'महाराष्ट्र मंडी निर्देशिका सूची' },
  'mandi.directory_subtitle': { en: 'Official agricultural produce market committees (APMC) in Maharashtra', mr: 'महाराष्ट्रातील अधिकृत कृषी उत्पन्न बाजार समित्या (APMC)' },
  'mandi.my_location': { en: 'Use My Location', mr: 'माझे स्थान वापरा' },

  // Chatbot & Voice
  'chat.title': { en: 'KisanMitra Voice & Text Assistant', mr: 'किसानमित्र व्हॉइस आणि टेक्स्ट सहाय्यक' },
  'chat.subtitle': { en: 'Ask market prices via audio recording or text', mr: 'व्हॉइस रेकॉर्डिंग किंवा मजकुराद्वारे मंडी भाव विचारा' },
  'chat.placeholder': { en: 'Ask about mandi prices or click microphone...', mr: 'मंडी भावाबद्दल विचारा किंवा मायक्रोफोन वापरा...' },
  'chat.mic_start': { en: 'Speak Voice Query', mr: 'व्हॉइस प्रश्न बोला' },
  'chat.mic_stop': { en: 'Stop & Transcribe', mr: 'थांबवा आणि उत्तर मिळवा' },
  'chat.transcribing': { en: 'Processing Whisper Speech-to-Text...', mr: 'आवाज ट्रान्सक्राइब होत आहे...' },
  'chat.tts_read': { en: 'Read out loud', mr: 'आवाजात ऐका' },
  'chat.quick_prompt1': { en: 'Onion prices in Nashik', mr: 'नाशिक मधील कांदा भाव' },
  'chat.quick_prompt2': { en: 'Soybean rate in Latur', mr: 'लातूर मधील सोयाबीन भाव' },
  'chat.quick_prompt3': { en: 'Cotton rates in Nagpur', mr: 'नागपूर मधील कापूस भाव' },
  'chat.send': { en: 'Send Query', mr: 'पाठवा' },

  // Geography & Maps
  'geo.title': { en: 'Maharashtra Participant Location Map', mr: 'महाराष्ट्र सहभागी नकाशा' },
  'geo.subtitle': { en: 'Geographical distribution of Farmers, FPOs, Buyers, Storage Managers & Transport in Maharashtra', mr: 'महाराष्ट्रातील शेतकरी, FPO, व्यापारी, गोदाम आणि वाहतूक व्यवस्थापक नकाशा' },
  'geo.default_location': { en: 'Default Location: Maharashtra, India', mr: 'मूलस्थान: महाराष्ट्र, भारत' },
  'geo.filter_district': { en: 'Filter District', mr: 'जिल्हा निवडा' },
  'geo.filter_role': { en: 'Filter Role', mr: 'भूमिका निवडा' },
  'geo.all_districts': { en: 'All Maharashtra Districts', mr: 'सर्व महाराष्ट्र जिल्हे' },
  'geo.admin_note': { en: 'System Administrator profiles are management accounts and are excluded from public map markers.', mr: 'प्रशासक प्रोफाईल सार्वजनिक नकाशा चिन्हांमधून वगळले आहेत.' },
  'geo.directory_title': { en: 'Maharashtra Network Participants Directory', mr: 'महाराष्ट्र नेटवर्क सहभागी सूची' },

  // Documents
  'doc.title': { en: 'Document Support Services', mr: 'कागदपत्रे आणि दस्तऐवज सेवा' },
  'doc.subtitle': { en: 'Upload and manage agricultural land records (7/12), licenses, certificates, and ID proof', mr: '७/१२ उतारा, परवाने, गुणवत्ता प्रमाणपत्रे आणि ओळखपत्रे व्यवस्थापित करा' },
  'doc.upload_btn': { en: 'Upload Document', mr: 'कागदपत्र अपलोड करा' },
  'doc.select_type': { en: 'Document Category', mr: 'कागदपत्र प्रकार' },
  'doc.land_record': { en: 'Land Record (7/12 Extract)', mr: '७/१२ सातबारा उतारा' },
  'doc.fpo_cert': { en: 'FPO Registration Certificate', mr: 'FPO नोंदणी प्रमाणपत्र' },
  'doc.trade_license': { en: 'Trade / Business License', mr: 'व्यापार परवाना' },
  'doc.id_proof': { en: 'Government ID Proof (Aadhaar/PAN)', mr: 'ओळखपत्र (आधार/पॅन)' },
  'doc.quality_cert': { en: 'Quality & Organic Certification', mr: 'गुणवत्ता व सेंद्रिय प्रमाणपत्र' },
  'doc.warehouse_license': { en: 'Warehouse / Cold Storage License', mr: 'गोदाम / शीतगृह परवाना' },
  'doc.transport_permit': { en: 'Transport Permit & Vehicle RC', mr: 'वाहतूक परवाना आणि वाहन पास' },
  'doc.no_docs': { en: 'No documents uploaded yet. Upload your official certificates for instant profile verification.', mr: 'अद्याप कोणतेही कागदपत्र अपलोड केलेले नाही. सत्यापनासाठी तुमचे प्रमाणपत्र अपलोड करा.' },

  // Account Management Modal
  'account.title': { en: 'Account Management & Settings', mr: 'खाते व्यवस्थापन आणि सेटिंग्ज' },
  'account.subtitle': { en: 'Update user profile, geographical location, and assigned platform role.', mr: 'वापरकर्ता प्रोफाइल, भौगोलिक स्थान आणि भूमिका अद्ययावत करा.' },
  'account.full_name': { en: 'Full Name', mr: 'पूर्ण नाव' },
  'account.email': { en: 'Email Address', mr: 'ईमेल पत्ता' },
  'account.phone': { en: 'Phone Number', mr: 'फोन नंबर' },
  'account.district': { en: 'Maharashtra District', mr: 'महाराष्ट्र जिल्हा' },
  'account.role': { en: 'Assigned User Role', mr: 'नियुक्त भूमिका' },
  'account.save': { en: 'Save Profile Changes', mr: 'बदल जतन करा' },
  'account.cancel': { en: 'Cancel', mr: 'रद्द करा' },
};

// Domain Localization Dictionaries
export const CROP_LOCALIZATION: Record<string, { en: string; mr: string }> = {
  'onion': { en: 'Onion', mr: 'कांदा' },
  'red onion': { en: 'Red Onion', mr: 'लाल कांदा' },
  'tomato': { en: 'Tomato', mr: 'टोमॅटो' },
  'potato': { en: 'Potato', mr: 'बटाटा' },
  'wheat': { en: 'Wheat', mr: 'गहू' },
  'rice': { en: 'Rice', mr: 'तांदूळ' },
  'soybean': { en: 'Soybean', mr: 'सोयाबीन' },
  'cotton': { en: 'Cotton', mr: 'कापूस' },
  'sugarcane': { en: 'Sugarcane', mr: 'ऊस' },
  'maize': { en: 'Maize', mr: 'मका' },
  'groundnut': { en: 'Groundnut', mr: 'भुईमूग' },
  'pomegranate': { en: 'Pomegranate', mr: 'डाळिंब' },
  'turmeric': { en: 'Turmeric', mr: 'हळद' },
  'grapes': { en: 'Grapes', mr: 'द्राक्षे' },
  'pulses': { en: 'Pulses', mr: 'डाळी' },
  'jaggery': { en: 'Jaggery', mr: 'गूळ' },
  'mango': { en: 'Mango', mr: 'आंबा' },
  'banana': { en: 'Banana', mr: 'केळी' },
  'gram': { en: 'Gram', mr: 'हरभरा' },
  'moong': { en: 'Moong', mr: 'मूग' },
  'urad': { en: 'Urad', mr: 'उडीद' },
};

export const DISTRICT_LOCALIZATION: Record<string, { en: string; mr: string }> = {
  'pune': { en: 'Pune', mr: 'पुणे' },
  'nashik': { en: 'Nashik', mr: 'नाशिक' },
  'mumbai': { en: 'Mumbai', mr: 'मुंबई' },
  'nagpur': { en: 'Nagpur', mr: 'नागपूर' },
  'solapur': { en: 'Solapur', mr: 'सोलापूर' },
  'kolhapur': { en: 'Kolhapur', mr: 'कोल्हापूर' },
  'latur': { en: 'Latur', mr: 'लातूर' },
  'satara': { en: 'Satara', mr: 'सातारा' },
  'chhatrapati sambhajinagar': { en: 'Chhatrapati Sambhajinagar', mr: 'छत्रपती संभाजीनगर' },
  'amravati': { en: 'Amravati', mr: 'अमरावती' },
  'jalgaon': { en: 'Jalgaon', mr: 'जळगाव' },
  'ahmednagar': { en: 'Ahmednagar', mr: 'अहमदनगर' },
  'akola': { en: 'Akola', mr: 'अकोला' },
  'sangli': { en: 'Sangli', mr: 'सांगली' },
};

export const UNIT_LOCALIZATION: Record<string, { en: string; mr: string }> = {
  'quintal': { en: 'Quintal', mr: 'क्विंटल' },
  'q': { en: 'Quintal', mr: 'क्विंटल' },
  'kg': { en: 'kg', mr: 'किलो' },
  'ton': { en: 'Ton', mr: 'टन' },
  'mt': { en: 'MT', mr: 'मेट्रिक टन' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
  tCrop: (cropName: string) => string;
  tDistrict: (districtName: string) => string;
  tUnit: (unitName: string) => string;
  tRole: (roleKey: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
  tCrop: (name: string) => name,
  tDistrict: (name: string) => name,
  tUnit: (name: string) => name,
  tRole: (role: string) => role,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = (localStorage.getItem('kisanmitra_lang') || localStorage.getItem('kisanmitra-language')) as Language;
    if (saved && ['en', 'mr'].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    if (lang !== 'en' && lang !== 'mr') return;
    setLanguageState(lang);
    localStorage.setItem('kisanmitra_lang', lang);
    localStorage.setItem('kisanmitra-language', lang);
  };

  const t = (key: string, replacements?: Record<string, string | number>): string => {
    const item = translations[key];
    let result = key;
    if (item) {
      result = item[language] || item['en'] || key;
    }
    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        result = result.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    return result;
  };

  const tCrop = (cropName: string): string => {
    if (!cropName) return '';
    const key = cropName.toLowerCase().trim();
    const item = CROP_LOCALIZATION[key];
    if (item) return item[language] || item['en'] || cropName;
    return cropName;
  };

  const tDistrict = (districtName: string): string => {
    if (!districtName) return '';
    const key = districtName.toLowerCase().trim();
    const item = DISTRICT_LOCALIZATION[key];
    if (item) return item[language] || item['en'] || districtName;
    return districtName;
  };

  const tUnit = (unitName: string): string => {
    if (!unitName) return '';
    const key = unitName.toLowerCase().trim();
    const item = UNIT_LOCALIZATION[key];
    if (item) return item[language] || item['en'] || unitName;
    return unitName;
  };

  const tRole = (roleKey: string): string => {
    const lower = roleKey.toLowerCase().replace(/\s+/g, '_');
    const fullKey = `role.${lower}`;
    return t(fullKey) !== fullKey ? t(fullKey) : t(`role.${roleKey.toLowerCase()}`);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tCrop, tDistrict, tUnit, tRole }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
