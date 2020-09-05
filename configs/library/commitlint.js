const { COMMIT_TYPE } = require('./commit-types');

const ERROR_LEVEL = {
  ALLOWED: 0,
  WARNING: 1,
  ERROR: 2,
};

const WHEN = {
  ALWAYS: 'always',
  NEVER: 'never',
};

module.exports = {
  rules: {
    'type-enum': [ERROR_LEVEL.ERROR, WHEN.ALWAYS, Object.values(COMMIT_TYPE)],
    'type-case': [ERROR_LEVEL.ERROR, WHEN.ALWAYS, 'pascal-case'],
    'type-empty': [ERROR_LEVEL.ERROR, WHEN.NEVER],
  },
};
