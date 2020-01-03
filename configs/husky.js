module.exports = {
  hooks: {
    'commit-msg': 'tk-validate-commit-message',
    'pre-commit': 'lint-staged',
  },
};
