module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', 'react-hooks'],
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    '@typescript-eslint/no-var-requires': 0,
    'react-native/no-raw-text': 0,
    'no-plusplus': 0,
    'react/display-name': 0,
    '@typescript-eslint/ban-ts-ignore': 0,
    'no-underscore-dangle': 0,
    'no-case-declarations': 0,
    '@typescript-eslint/no-explicit-any': 0,
    camelcase: 0,
    semi: 0,
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'comma-dangle': ['error', 'never'],
    indent: ['error', 2],
    'react-native/no-inline-styles': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  }
}
