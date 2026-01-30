import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../../../resources/localization/en.json'
import ch from '../../../resources/localization/ch.json'
import de from '../../../resources/localization/de.json'
import fr from '../../../resources/localization/fr.json'
import ru from '../../../resources/localization/ru.json'
import sp from '../../../resources/localization/sp.json'
import uk from '../../../resources/localization/uk.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      de: { translation: de },
      ch: { translation: ch },
      fr: { translation: fr },
      sp: { translation: sp },
      uk: { translation: uk }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;