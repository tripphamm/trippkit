#!/usr/bin/env node

const spawn = require('cross-spawn');
const localEnv = require('@tripphamm/trippkit/utils/env');

const env = localEnv.read();

localEnv.validate(env, ['GITHUB_TOKEN', 'NPM_TOKEN']);

// --ci false skips the only-ci check
// this allows us to execute the release locally if we want
const semanticReleaseResult = spawn.sync('semantic-release', ['--ci', 'false'], {
  env,
  stdio: 'inherit',
});

if (semanticReleaseResult.status !== 0) {
  process.exit(semanticReleaseResult.status);
}

// // semantic release should have
// const rootPackageJson = require('./package.json');

// const lernaVersionResult = spawn.sync('lerna', ['version', rootPackageJson.version]);
