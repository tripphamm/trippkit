#!/usr/bin/env node

const spawn = require('cross-spawn');
const fs = require('fs');
const localEnv = require('@tripphamm/trippkit/utils/env');

const env = localEnv.read();

localEnv.validate(env, ['GITHUB_TOKEN', 'NPM_TOKEN']);

const spawnOpts = {
  env,
  encoding: 'utf8',
  stdio: 'inherit',
};

if (env['CI'] === 'true') {
  console.log('CI Environment detected');

  // in CI we need to embed our github token into the origin url so that we can push a commit
  const repository = require('./package.json').repository;

  // we need to inject the auth info after the prefix and before the rest

  const prefix = 'https://';

  if (!repository.startsWith(prefix)) {
    console.error(`Expected repository to start with ${prefix}. Got,`, repository);
    process.exit(1);
  }

  const authenticatedGitOrigin = [
    repository.slice(0, prefix.length),
    `tripphamm:${env['GITHUB_TOKEN']}@`,
    repository.slice(prefix.length),
  ].join('');

  const gitSetOriginResult = spawn.sync(
    'git',
    ['remote', 'set-origin', authenticatedGitOrigin],
    spawnOpts,
  );

  if (gitSetOriginResult.status !== 0) {
    process.exit(gitSetOriginResult.status);
  }

  console.log('Set origin to: ', authenticatedGitOrigin);

  // we need a .npmrc file which references the NPM_TOKEN env var
  // note that this isn't actually embedding the token itself into the file, just the literal string "${NPM_TOKEN}"
  // we _could_ just commit this file to the repo, but that would require devs to have NPM_TOKEN defined on their system
  // and we don't want to require that
  try {
    fs.writeFileSync('./.npmrc', '//registry.npmjs.org/:_authToken=${NPM_TOKEN}', {
      encoding: 'utf8',
    });

    console.log('Created .npmrc');
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
}

// // --ci false skips the only-ci check
// // this allows us to execute the release locally if we want
const semanticReleaseResult = spawn.sync('semantic-release', ['--ci', 'false'], spawnOpts);

if (semanticReleaseResult.status !== 0) {
  process.exit(semanticReleaseResult.status);
}

console.log('Finished semantic release');

// semantic-release should have tagged the latest commit with the new version
// we'll use git to grab that tag in order to figure out the proper version to use
const gitVersionResult = spawn.sync('git', ['describe', '--tags'], {
  ...spawnOpts,
  // change stdio to pipe so that we can get access to the output
  stdio: 'pipe',
});

if (gitVersionResult.status !== 0) {
  process.exit(gitVersionResult.status);
}

const version = gitVersionResult.stdout.trim();

if (/^v\d+\.\d+\.\d+$/.test(version) === false) {
  console.error('Unexpected version', version);
  process.exit(1);
}

// remove the "v"
const versionNumber = version.slice(1);

console.log('Found tag for version', version);

const lernaVersionResult = spawn.sync(
  'lerna',
  [
    'version',
    versionNumber,
    '--yes',
    '--message',
    'Chore: Release',
    '--tag-version-prefix',
    'lerna-v',
  ],
  spawnOpts,
);

if (lernaVersionResult.status !== 0) {
  process.exit(lernaVersionResult.status);
}

console.log('lerna version updated each package');

spawn.sync('git', ['status'], spawnOpts);

const lernaPublishResult = spawn.sync(
  'lerna',
  ['publish', 'from-package', '--yes', '--message', `Chore: Release ${version} [skip ci]`],
  spawnOpts,
);

if (lernaPublishResult.status !== 0) {
  process.exit(lernaPublishResult.status);
}

console.log('Done');
