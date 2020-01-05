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

const result = spawn.sync(
  'semantic-release',
  ['-e', 'semantic-release-monorepo', '--ci', 'false'],
  spawnOpts,
);

if (result.status !== 0) {
  process.exit(result.status);
}
