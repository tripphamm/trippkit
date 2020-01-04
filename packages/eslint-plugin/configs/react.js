module.exports = {
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
  },
  extends: [
    // adds linting for react
    'plugin:react/recommended',
    // disable linting rules from react
    'prettier/react',
  ],
  plugins: [
    // additional linting for React hooks
    'react-hooks',
    // accessibility linting for jsx
    'jsx-a11y',
  ],
  rules: {
    // error if any of the React hooks rules are violated
    'react-hooks/rules-of-hooks': 'error',
    // warn when hook-deps look wrong (this is almost always an error)
    'react-hooks/exhaustive-deps': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'react/prop-types': 'off',
      },
    },
  ],
};
