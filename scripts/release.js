#!/usr/bin/env node

const spawn = require('cross-spawn');
const localEnv = require('@tripphamm/trippkit/utils/env');

const env = localEnv.read();

localEnv.validate(env, ['GITHUB_TOKEN', 'NPM_TOKEN']);

const spawnOpts = {
  env,
  encoding: 'utf8',
  stdio: 'inherit',
};

// // --ci false skips the only-ci check
// // this allows us to execute the release locally if we want
const semanticReleaseResult = spawn.sync('semantic-release', ['--ci', 'false'], spawnOpts);

if (semanticReleaseResult.status !== 0) {
  process.exit(semanticReleaseResult.status);
}

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

const lernaVersionResult = spawn.sync(
  'lerna',
  ['version', versionNumber, '--yes', '--message', 'Chore: Release'],
  spawnOpts,
);

if (lernaVersionResult.status !== 0) {
  process.exit(lernaVersionResult.status);
}

const lernaPublishResult = spawn.sync(
  'lerna',
  ['publish', 'from-package', '--yes', '--message', 'Chore: Release'],
  env,
);

if (lernaPublishResult.status !== 0) {
  process.exit(lernaPublishResult.status);
}
