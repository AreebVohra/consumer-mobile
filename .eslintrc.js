module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-native',
  ],
  rules: {
    'no-unused-vars': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'arrow-parens': 'off',
    'no-use-before-define': 'off',
    'react/style-prop-object': 'off',
    'react/jsx-props-no-spreading': 'off',
    'global-require': 'off',
    'array-callback-return': 'off',
    'consistent-return': 'off',
    'max-len': 'off',
    'no-console': 'off',
    'object-curly-newline': 'off',
  },
};
