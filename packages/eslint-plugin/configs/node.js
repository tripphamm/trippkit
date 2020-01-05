module.exports = {
  env: {
    node: true,
  },
  extends: ['./base'],
  rules: {
    // allow `require` imports
    '@typescript-eslint/no-var-requires': 'off',
  },
};
