module.exports = {
  branch: 'master',
  preset: 'eslint',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',

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
        message: 'Chore: ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
};
