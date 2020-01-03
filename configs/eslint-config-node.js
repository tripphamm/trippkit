module.exports = {
  env: {
    node: true,
  },
  extends: ['./eslint-config-base.js'],
  rules: {
    // allow `require` imports
    '@typescript-eslint/no-var-requires': 'off',
  },
};
