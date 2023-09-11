module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    // "eslint:recommended",
    'plugin:react/recommended',
    // 'react-app',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    // "plugin:prettier/recommended"
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'react-hooks'],
  settings: { react: { version: 'detect' } },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'no-unused-vars': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
  globals: { chrome: 'readonly' },
  ignorePatterns: ['watch.js', 'dist/**'],
}
