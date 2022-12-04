import i18next from 'i18next';
import { I18nManager as RNI18nManager } from 'react-native';
import en from 'config/en.json';
import ar from 'config/ar.json';
import * as config from '../../config/i18n';
import date from './date';
import languageDetector from './language-detector';
// import translationLoader from './translation-loader';

const resources = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
};

const i18n = {
  /**
     * @returns {Promise}
     */
  init: () => new Promise((resolve, reject) => {
    i18next
      .use(languageDetector)
    //   .use(translationLoader)
      .init({
        fallbackLng: config.fallback,
        // ns: config.namespaces,
        // defaultNS: config.defaultNamespace,
        interpolation: {
          escapeValue: false,
          format(value, format) {
            if (value instanceof Date) {
              return date.format(value, format);
            }
          },
        },
        debug: false,
        languages: ['en', 'ar'],
        resources,
        // fallbackLng: 'en',
        // keySeparator: false, // we do not use keys in form messages.welcome
        // interpolation: {
        //   escapeValue: false, // react already safes from xss
        // },
      }, (error) => {
        if (error) {
          return reject(error);
        }
        date.init(i18next.language)
          .then(resolve)
          .catch(error => reject(error));
      });
  }),
  /**
     * @param {string} lang
     */
  changeLanguage: (lang) => i18next.changeLanguage(lang),
  /**
     * @param {string} key
     * @param {Object} options
     * @returns {string}
     */
  t: (key, options) => i18next.t(key, options),
  /**
     * @returns {string}
     */
  get locale() { return i18next.language; },
  /**
     * @returns {'LTR' | 'RTL'}
     */
  get dir() {
    return i18next.dir().toUpperCase();
  },
  /**
     * @returns {boolean}
     */
  get isRTL() {
    return RNI18nManager.isRTL;
  },
  /**
     * Similar to React Native's Platform.select(),
     * i18n.select() takes a map with two keys, 'rtl'
     * and 'ltr'. It then returns the value referenced
     * by either of the keys, given the current
     * locale's direction.
     *
     * @param {Object<string,mixed>} map
     * @returns {mixed}
     */
  select(map) {
    const key = this.isRTL ? 'rtl' : 'ltr';
    return map[key];
  },
};

export const { t } = i18n;
export default i18n;
