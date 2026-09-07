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
  'nav.overview': { en: 'Overview', mr: 'विहंगावलोकन', hi: 'अवलोकन' },
  'nav.produce': { en: 'Produce', mr: 'शेतमाल', hi: 'उपज' },
  'nav.offers': { en: 'Offers', mr: 'प्रस्ताव', hi: 'ऑफर' },
  'nav.trades': { en: 'Trades', mr: 'व्यापार', hi: 'व्यापार' },
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
  'header.demo_mode': { en: 'Demo Switcher Active', mr: 'डेमो मोड सक्रिय', hi: 'डेमो मोड सक्रिय' },
  'header.authenticated': { en: 'Authenticated Profile', mr: 'प्रमाणित प्रोफाईल', hi: 'प्रमाणित प्रोफ़ाइल' },

  // Listings & Controls (Show More / Limits)
  'listing.show_more': { en: 'Show More Items', mr: 'आणखी पहा', hi: 'और दिखाएं' },
  'listing.show_less': { en: 'Show Less', mr: 'कमी करा', hi: 'कम दिखाएं' },
  'listing.showing_limit': { en: 'Showing {current} of {total} listings', mr: 'एकूण {total} पैकी {current} दाखवत आहे', hi: 'कुल {total} में से {current} दिख रहे हैं' },
  'listing.items_per_page': { en: 'Items per page', mr: 'प्रति पृष्ठ वस्तू', hi: 'प्रति पृष्ठ आइटम' },
  'listing.no_results': { en: 'No listings found matching your search.', mr: 'तुमच्या शोधानुसार कोणतेही निकाल सापडले नाहीत.', hi: 'आपकी खोज से मेल खाने वाले कोई परिणाम नहीं मिले।' },
  'listing.all': { en: 'All Items', mr: 'सर्व निकाल', hi: 'सभी परिणाम' },

  // Mandi & Stock UI
  'mandi.ticker_title': { en: 'Maharashtra Live Mandi Stock Ticker', mr: 'महाराष्ट्र लाईव्ह मंडी स्टॉक टिकर', hi: 'महाराष्ट्र लाइव मंडी स्टॉक टिकर' },
  'mandi.ticker_updated': { en: 'Updated live from AgMarknet', mr: 'AgMarknet कडून थेट अद्यतनित', hi: 'AgMarknet से लाइव अपडेट' },
  'mandi.title': { en: 'Stock Market Pricing Board', mr: 'बाजार भाव आणि स्टॉक बोर्ड', hi: 'स्टॉक मार्केट मूल्य बोर्ड' },
  'mandi.subtitle': { en: 'Real-time agricultural commodity pricing, arrival volumes, and price ranges across Maharashtra Mandis.', mr: 'महाराष्ट्रातील मंड्यांमधील थेट शेतमाल भाव, आवक आणि किमतींची श्रेणी.', hi: 'महाराष्ट्र मंडियों में वास्तविक समय में कृषि उपज मूल्य, आवक और मूल्य सीमाएं।' },
  'mandi.refresh': { en: 'Refresh Ticker', mr: 'ताजे करा', hi: 'रिफ्रेश करें' },
  'mandi.demo_notice': { en: 'Prices marked AGMARKNET-DEMO represent realistic historical Maharashtra mandi trends.', mr: 'AGMARKNET-DEMO चिन्हित भाव महाराष्ट्रातील वास्तववादी मंडी ट्रेंड दर्शवतात.', hi: 'AGMARKNET-DEMO चिन्हित मूल्य वास्तविक महाराष्ट्र मंडी प्रवृत्तियों को दर्शाते हैं।' },
  'mandi.filter_title': { en: 'Filter Commodity Stock Board', mr: 'शेतमाल स्टॉक बोर्ड फिल्टर करा', hi: 'उपज स्टॉक बोर्ड फ़िल्टर करें' },
  'mandi.all_produce': { en: 'All Produce', mr: 'सर्व शेतमाल', hi: 'सभी उपज' },
  'mandi.top_gainers': { en: 'Top Gainers 📈', mr: 'सर्वाधिक वाढ 📈', hi: 'टॉप गेनर्स 📈' },
  'mandi.top_losers': { en: 'Top Losers 📉', mr: 'सर्वाधिक घसरण 📉', hi: 'टॉप लूसर्स 📉' },
  'mandi.col_commodity': { en: 'Commodity', mr: 'शेतमाल', hi: 'उपज' },
  'mandi.col_mandi': { en: 'Mandi / Market', mr: 'मंडी / बाजार', hi: 'मंडी / बाजार' },
  'mandi.col_district': { en: 'District', mr: 'जिल्हा', hi: 'जिला' },
  'mandi.col_price': { en: 'Modal Price', mr: 'सरासरी भाव (₹/क्विंटल)', hi: 'औसत मूल्य (₹/क्विंटल)' },
  'mandi.col_trend': { en: '24h Trend', mr: '२४ तास कल', hi: '24 घंटे का रुझान' },
  'mandi.col_range': { en: 'Day Price Range (Min - Max)', mr: 'दिवसाची भाव मर्यादा (किमान - कमाल)', hi: 'दिन की मूल्य सीमा (न्यूनतम - अधिकतम)' },
  'mandi.col_date': { en: 'Arrival Date', mr: 'आवक दिनांक', hi: 'आवक तिथि' },
  'mandi.directory_title': { en: 'Maharashtra Mandi Directory List', mr: 'महाराष्ट्र मंडी निर्देशिका सूची', hi: 'महाराष्ट्र मंडी निर्देशिका सूची' },
  'mandi.directory_subtitle': { en: 'Official agricultural produce market committees (APMC) in Maharashtra', mr: 'महाराष्ट्रातील अधिकृत कृषी उत्पन्न बाजार समित्या (APMC)', hi: 'महाराष्ट्र में आधिकारिक कृषि उपज बाजार समितियां (APMC)' },
  'mandi.my_location': { en: 'Use My Location', mr: 'माझे स्थान वापरा', hi: 'मेरा स्थान उपयोग करें' },

  // Chatbot & Voice
  'chat.title': { en: 'KisanMitra Voice & Text Assistant', mr: 'किसानमित्र व्हॉइस आणि टेक्स्ट सहाय्यक', hi: 'किसानमित्र वॉयस और टेक्स्ट असिस्टेंट' },
  'chat.subtitle': { en: 'Ask market prices via audio recording or text', mr: 'व्हॉइस रेकॉर्डिंग किंवा मजकुराद्वारे मंडी भाव विचारा', hi: 'वॉयस रिकॉर्डिंग या टेक्स्ट के माध्यम से मंडी भाव पूछें' },
  'chat.placeholder': { en: 'Ask about mandi prices or click microphone...', mr: 'मंडी भावाबद्दल विचारा किंवा मायक्रोफोन वापरा...', hi: 'मंडी भाव के बारे में पूछें या माइक का उपयोग करें...' },
  'chat.mic_start': { en: 'Speak Voice Query', mr: 'व्हॉइस प्रश्न बोला', hi: 'वॉयस प्रश्न बोलें' },
  'chat.mic_stop': { en: 'Stop & Transcribe', mr: 'थांबवा आणि उत्तर मिळवा', hi: 'रोकें और उत्तर पाएं' },
  'chat.transcribing': { en: 'Processing Whisper Speech-to-Text...', mr: 'आवाज ट्रान्सक्राइब होत आहे...', hi: 'आवाज ट्रांसक्राइब हो रही है...' },
  'chat.tts_read': { en: 'Read out loud', mr: 'आवाजात ऐका', hi: 'आवाज़ में सुनें' },
  'chat.quick_prompt1': { en: 'Onion prices in Nashik', mr: 'नाशिक मधील कांदा भाव', hi: 'नासिक में प्याज का भाव' },
  'chat.quick_prompt2': { en: 'Soybean rate in Latur', mr: 'लातूर मधील सोयाबीन भाव', hi: 'लातुर में सोयाबीन का भाव' },
  'chat.quick_prompt3': { en: 'Cotton rates in Nagpur', mr: 'नागपूर मधील कापूस भाव', hi: 'नागपुर में कपास का भाव' },
  'chat.send': { en: 'Send Query', mr: 'पाठवा', hi: 'भेजें' },

  // Geography & Maps
  'geo.title': { en: 'Maharashtra Participant Location Map', mr: 'महाराष्ट्र सहभागी नकाशा', hi: 'महाराष्ट्र प्रतिभागी मानचित्र' },
  'geo.subtitle': { en: 'Geographical distribution of Farmers, FPOs, Buyers, Storage & Transport in Maharashtra', mr: 'महाराष्ट्रातील शेतकरी, FPO, व्यापारी आणि लॉजिस्टिक्स नकाशा', hi: 'महाराष्ट्र में किसानों, FPO, खरीदारों और रसद का नक्शा' },
  'geo.default_location': { en: 'Default Location: Maharashtra, India', mr: 'मूलस्थान: महाराष्ट्र, भारत', hi: 'डिफ़ॉल्ट स्थान: महाराष्ट्र, भारत' },
  'geo.filter_district': { en: 'Filter District', mr: 'जिल्हा निवडा', hi: 'जिला चुनें' },
  'geo.filter_role': { en: 'Filter Role', mr: 'भूमिका निवडा', hi: 'भूमिका चुनें' },
  'geo.all_districts': { en: 'All Maharashtra Districts', mr: 'सर्व महाराष्ट्र जिल्हे', hi: 'सभी महाराष्ट्र जिले' },
  'geo.admin_note': { en: 'Admin profiles are management accounts and are excluded from public map markers.', mr: 'प्रशासक प्रोफाईल सार्वजनिक नकाशा चिन्हांमधून वगळले आहेत.', hi: 'प्रशासक प्रोफ़ाइल सार्वजनिक मानचित्र चिह्नों से बाहर हैं।' },
  'geo.directory_title': { en: 'Maharashtra Network Participants Directory', mr: 'महाराष्ट्र नेटवर्क सहभागी सूची', hi: 'महाराष्ट्र नेटवर्क प्रतिभागी निर्देशिका' },

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
  'doc.col_title': { en: 'Document Title', mr: 'दस्तऐवज शीर्षक', hi: 'दस्तावेज़ शीर्षक' },
  'doc.col_category': { en: 'Category', mr: 'प्रकार', hi: 'श्रेणी' },
  'doc.col_status': { en: 'Verification Status', mr: 'सत्यापन स्थिती', hi: 'सत्यापन स्थिति' },
  'doc.col_date': { en: 'Uploaded Date', mr: 'अपलोड तारीख', hi: 'अपलोड तिथि' },
  'doc.col_actions': { en: 'Actions', mr: 'कृती', hi: 'कार्रवाई' },

  // Account Management Modal
  'account.title': { en: 'Account Management & Settings', mr: 'खाते व्यवस्थापन आणि सेटिंग्ज', hi: 'खाता प्रबंधन और सेटिंग्स' },
  'account.subtitle': { en: 'Update user profile, geographical location, and assigned platform role.', mr: 'वापरकर्ता प्रोफाइल, भौगोलिक स्थान आणि भूमिका अद्ययावत करा.', hi: 'उपयोगकर्ता प्रोफ़ाइल, भौगोलिक स्थान और सौंपी गई प्लेटफ़ॉर्म भूमिका को अपडेट करें।' },
  'account.full_name': { en: 'Full Name', mr: 'पूर्ण नाव', hi: 'पूरा नाम' },
  'account.email': { en: 'Email Address', mr: 'ईमेल पत्ता', hi: 'ईमेल पता' },
  'account.phone': { en: 'Phone Number', mr: 'फोन नंबर', hi: 'फ़ोन नंबर' },
  'account.district': { en: 'Maharashtra District', mr: 'महाराष्ट्र जिल्हा', hi: 'महाराष्ट्र जिला' },
  'account.role': { en: 'Assigned User Role', mr: 'नियुक्त भूमिका', hi: 'सौंपी गई भूमिका' },
  'account.save': { en: 'Save Profile Changes', mr: 'बदल जतन करा', hi: 'बदलाव सहेजें' },
  'account.cancel': { en: 'Cancel', mr: 'रद्द करा', hi: 'रद्द करें' },
  'account.status_verified': { en: 'KYC Verified Participant', mr: 'सत्यापित सभासद', hi: 'सत्यापित सदस्य' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
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

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
