const RELEASE_TYPE = {
  NONE: 'NONE',
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const COMMIT_TYPE = {
  BREAKING: 'Breaking',
  FIX: 'Fix',
  CHORE: 'Chore',
  NEW: 'New',
};

module.exports = {
  RELEASE_TYPE,
  COMMIT_TYPE,
  commitTypes: {
    [COMMIT_TYPE.CHORE]: {
      description: 'A not-user-facing change (e.g. tests, dev deps, tooling)',
      releaseType: RELEASE_TYPE.NONE,
    },
    [COMMIT_TYPE.NEW]: {
      description: 'A new feature',
      releaseType: RELEASE_TYPE.MINOR,
    },
    [COMMIT_TYPE.FIX]: {
      description: 'A bug fix',
      releaseType: RELEASE_TYPE.PATCH,
    },
    [COMMIT_TYPE.BREAKING]: {
      description: 'A backwards-incompatible enhancement/feature',
      releaseType: RELEASE_TYPE.MAJOR,
    },
  },
};
