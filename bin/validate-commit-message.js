#!/usr/bin/env node

/**
 * This script will validate a git commit-message against our conventions in order to ensure that our automated release logic works
 *
 * usage `node validate-commit-msg` (this will read the current commit message from the .git/COMMIT_EDITMSG file for an in-progress commit)
 * usage `node validate-commit-msg 'my cool commit message'` (this will validate an arbitrary string passed as an arg)
 */
const { readFileSync, existsSync } = require('fs');
const chalk = require('chalk');
const { commitTypes } = require('../configs/commit-types');

console.log(process.cwd());
console.log(process.argv);

let commitMessage;
if (process.argv.length >= 3) {
  commitMessage = process.argv[2];
} else {
  const gitCommitMessageFileLocation = './.git/COMMIT_EDITMSG';
  console.log('Validating commit message from .git/COMMIT_EDITMSG');

  if (!existsSync(gitCommitMessageFileLocation)) {
    console.error(chalk.red('Unable to locate .git/COMMIT_EDITMSG'));
    process.exit(1);
  }

  commitMessage = readFileSync(gitCommitMessageFileLocation, 'utf8');
}

console.log('commit', commitMessage);
const commitMessageMatch = /(.+?)(?:\((.+?)\))?: (.+)/.exec(commitMessage);

if (commitMessageMatch !== null) {
  const [, type, scope, subject] = commitMessageMatch;

  if (Object.keys(commitTypes).includes(type)) {
    console.log(`
${chalk.green('Success!')}

type: ${chalk.cyan(type)}
${scope !== undefined ? `scope: ${chalk.cyan(scope)}` : ''}
subject: ${chalk.cyan(subject)}
    `);

    process.exit(0);
    return;
  }
}

console.error(`
${chalk.red('Commit message failed validation')}

${commitMessage}

❌ ${chalk.yellow('Commit message must start with one of the following "types"')}

[${chalk.yellow(Object.keys(commitTypes).join(', '))}]

e.g.
${chalk.cyan('New: Add an awesome new feature')}
${chalk.cyan('Fix: Fix bug with slides')}

This convention is what allows us to automatically determine when to release a new major/minor/patch version
  `);

process.exit(1);
