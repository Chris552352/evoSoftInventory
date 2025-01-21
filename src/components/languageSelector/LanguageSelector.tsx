import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

export const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-selector">
      <span>{t('language')}: </span>
      <select
        value={i18n.language}
        defaultValue={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
      >
        <option value="fr">Français</option>
        <option value="en">Anglais</option>
      </select>
    </div>
  );
};
