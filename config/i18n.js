export const fallback = 'en';
export const supportedLocales = {
  en: {
    name: 'English',
    translationFileLoader: () => require('./en.json'),
    // en is default locale in Moment
    momentLocaleLoader: () => Promise.resolve(),
  },
  ar: {
    name: 'العربية',
    translationFileLoader: () => require('./ar.json'),
    momentLocaleLoader: () => import('moment/locale/ar'),
  },
};
export const defaultNamespace = 'common';
export const namespaces = [
  'common',
];
