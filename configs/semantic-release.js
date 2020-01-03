const { RELEASE_TYPE, COMMIT_TYPE, commitTypes } = require('./commit-types');

/**
 * Maps our notion of a release type to Semantic Release's notion of a release type
 */
const semanticReleaseReleaseTypeMap = {
  [RELEASE_TYPE.NONE]: null,
  [RELEASE_TYPE.PATCH]: 'patch',
  [RELEASE_TYPE.MINOR]: 'minor',
  [RELEASE_TYPE.MAJOR]: 'major',
};

module.exports = {
  branch: 'master',
  preset: 'eslint',
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        releaseRules: Object.entries(commitTypes)
          .filter(([, commitConfig]) => commitConfig.releaseType !== RELEASE_TYPE.NONE)
          .map(([commitType, commitConfig]) => {
            return {
              tag: commitType,
              release: semanticReleaseReleaseTypeMap[commitConfig.releaseType],
            };
          }),
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        writerOpts: {
          // sort release notes with Breaking on the top and Internal on the bottom
          commitGroupsSort: [
            COMMIT_TYPE.BREAKING,
            COMMIT_TYPE.NEW,
            COMMIT_TYPE.FIX,
            COMMIT_TYPE.INTERNAL,
          ],
          // ignore Internal commits for the release notes
          transform: (commit) => {
            if (commit.tag === COMMIT_TYPE.INTERNAL) {
              return undefined;
            }

            return commit;
          },
        },
      },
    ],
    // publish release notes
    '@semantic-release/github',
    // publish to NPM
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
        pkgRoot: '.',
      },
    ],
    // commit the package.json
    [
      '@semantic-release/git',
      {
        assets: ['package.json'],
        message: 'Internal: ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
};
