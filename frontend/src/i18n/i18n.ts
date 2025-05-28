import i18n                 from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector     from 'i18next-browser-languagedetector';
import SupportedLanguages   from './SupportedLanguages.ts';


i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
              supportedLngs: Object.values(SupportedLanguages).map(lang => lang.iso639),
              resources    : Object.fromEntries(Object.entries(SupportedLanguages).map(([ k, v ], i) => [ k, v.resource ])),
              fallbackLng  : 'fr',
              interpolation: {
                  escapeValue: false
              }
          }).then();

export default i18n;