#!/usr/bin/env node

const spawn = require('cross-spawn');
const fs = require('fs');
const localEnv = require('@tripphamm/trippkit/utils/env');

const env = localEnv.read();

localEnv.validate(env, ['GITHUB_TOKEN', 'NPM_TOKEN']);

// some tools use GH_TOKEN rather than GITHUB_TOKEN
env['GH_TOKEN'] = env['GITHUB_TOKEN'];

const spawnOpts = {
  env,
  encoding: 'utf8',
  stdio: 'inherit',
};

if (env['CI'] === 'true') {
  console.log('CI Environment detected');

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

const lernaPublishResult = spawn.sync(
  'lerna',
  ['publish', '--yes', '--conventional-commits', '--changelog-preset', 'eslint'],
  spawnOpts,
);

if (lernaPublishResult.status !== 0) {
  process.exit(lernaPublishResult.status);
}
