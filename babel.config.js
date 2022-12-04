module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            assets: './assets',
            components: './src/components',
            pages: './src/pages',
            api: './api',
            utils: './utils',
            reducers: './reducers',
            config: './config',
            services: './services',
            themes: './themes',
          },
        },
      ],
      '@babel/plugin-syntax-dynamic-import',
      'react-native-reanimated/plugin',
    ],
  };
};
