module.exports = {
  root: true,
  env: {
    node: false,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  rules: {
    'no-async-promise-executor': 'off',
    'import/no-cycle': 0
  },
};
