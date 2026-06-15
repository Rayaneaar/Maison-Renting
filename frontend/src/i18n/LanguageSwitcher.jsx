import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const toggle = () => {
    const next = i18n.language === 'en' ? 'fr' : i18n.language === 'fr' ? 'ar' : 'en';
    i18n.changeLanguage(next);
  };
  return (
    <button onClick={toggle} className="text-[11px] uppercase tracking-[0.22em] text-white/60 hover:text-white border border-white/15 rounded-full px-3 py-1">
      {i18n.language.toUpperCase()}
    </button>
  );
}
