module.exports = {
  hooks: {
    'commit-msg': 'jskit-validate-commit-message',
    'pre-commit': 'lint-staged',
  },
};
