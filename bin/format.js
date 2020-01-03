#!/usr/bin/env node

const spawn = require('cross-spawn');

const result = spawn.sync(
  'prettier',
  ['**/*.+(js|json|less|css|ts|tsx|md)', '--write', '--ignore-path', '.gitignore'],
  {
    stdio: 'inherit',
  },
);

process.exit(result.status);
