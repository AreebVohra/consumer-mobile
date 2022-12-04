import * as config from 'config/i18n';

const translationLoader = {
  type: 'backend',
  init: () => {},
  read(language, namespace, callback) {
    let resource;
    let error = null;
    try {
      resource = config
        .supportedLocales[language]
        .translationFileLoader()[namespace];
    } catch (_error) { error = _error; }
    callback(error, resource);
  },
};
export default translationLoader;
