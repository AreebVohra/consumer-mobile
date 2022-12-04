const languageDetector = {
  type: 'languageDetector',
  async: true,
  // will be handled on landing page always return en
  // bc get stored lang async corrupts i8next init
  detect: (callback) => {
    callback('en');
  },
  init: () => { },
  cacheUserLanguage: () => { },
};
export default languageDetector;
