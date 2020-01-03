#!/usr/bin/env node

const spawn = require('cross-spawn');
const localEnv = require('../utils/env');

const env = localEnv.read();

localEnv.validate(env, ['GITHUB_TOKEN', 'NPM_TOKEN']);

console.log(env['GITHUB_TOKEN']);

// --ci false skips the only-ci check
// this allows us to execute the release locally if we want
const result = spawn.sync('semantic-release', ['--ci', 'false'], {
  env,
  stdio: 'inherit',
});

process.exit(result.status);
