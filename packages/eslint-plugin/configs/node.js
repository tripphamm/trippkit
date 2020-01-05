module.exports = {
  env: {
    node: true,
  },
  extends: [require.resolve('./base.js')],
  rules: {
    // allow `require` imports
    '@typescript-eslint/no-var-requires': 'off',
  },
};
