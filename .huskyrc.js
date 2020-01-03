module.exports = {
  hooks: {
    'commit-msg': 'node ./bin/validate-commit-message',
    'pre-commit': 'lint-staged',
  },
};
