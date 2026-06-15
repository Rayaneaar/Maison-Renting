import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: {
      en: { translation: { "Collection": "Collection", "Buy": "Buy", "Rent": "Rent", "Dashboard": "Dashboard" } },
      fr: { translation: { "Collection": "Collection", "Buy": "Acheter", "Rent": "Louer", "Dashboard": "Tableau de bord" } },
      ar: { translation: { "Collection": "المجموعة", "Buy": "شراء", "Rent": "إيجار", "Dashboard": "لوحة التحكم" } }
    },
    interpolation: { escapeValue: false }
  });

export default i18n;
