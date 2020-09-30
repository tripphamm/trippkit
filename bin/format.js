#!/usr/bin/env node

const spawn = require('cross-spawn');

const result = spawn.sync(
  'prettier',
  ['**/*.+(js|jsx|ts|tsx|json|mdx)', '--write', '--ignore-path', '.gitignore'],
  {
    stdio: 'inherit',
  },
);

process.exit(result.status);
