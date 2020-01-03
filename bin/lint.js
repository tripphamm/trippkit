#!/usr/bin/env node

const spawn = require('cross-spawn');

const result = spawn.sync(
  'eslint',
  ['--ext', '.js,.jsx,.ts,.tsx', '--ignore-path', '.gitignore', '.'],
  {
    stdio: 'inherit',
  },
);

process.exit(result.status);
