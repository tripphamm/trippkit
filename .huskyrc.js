// we can't dogfood configs/husky because configs/husky assumes that jskit binaries are installed
module.exports = {
  hooks: {
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
    'pre-commit': 'lint-staged',
  },
};
