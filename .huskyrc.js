// we can't dogfood configs/husky because configs/husky assumes that jskit binaries are installed
module.exports = {
  hooks: {
    'commit-msg': 'node ./bin/validate-commit-message',
    'pre-commit': 'lint-staged',
  },
};
