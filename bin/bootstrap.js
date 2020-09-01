#!/usr/bin/env node

const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

function createFile(fileName, content) {
  return new Promise((resolve, reject) => {
    try {
      fs.exists(fileName, (exists) => {
        mkdirp(path.dirname(fileName), (mkdirpErr) => {
          if (mkdirpErr) {
            reject(mkdirpErr);
            return;
          }

          fs.writeFile(
            `${fileName}${exists ? '.jskit' : ''}`,
            content,
            { encoding: 'utf8' },
            (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            },
          );
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}

const packageJSON = JSON.parse(fs.readFileSync('./package.json', { encoding: 'utf8' }));

function addPackageJSONScript(scriptName, script) {
  if (packageJSON.scripts === undefined) {
    packageJSON.scripts = {};
  }

  if (packageJSON.scripts[scriptName] !== undefined) {
    return;
  }

  packageJSON.scripts[scriptName] = script;
}

async function eslint() {
  await createFile(
    './.eslintrc.js',
    "module.exports = { extends: ['@ejhammond/react', '@ejhammond/node'] }",
  );

  addPackageJSONScript('lint', 'jskit-lint');
}

async function prettier() {
  await createFile(
    './.prettierrc.js',
    "module.exports = require('@ejhammond/jskit/configs/prettier')",
  );

  addPackageJSONScript('format', 'jskit-format');
}

async function editorConfig() {
  return createFile(
    './.editorconfig',
    `
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
    `,
  );
}

async function lintStaged() {
  return createFile(
    './lint-staged.config.js',
    "module.exports = require('@ejhammond/jskit/configs/lint-staged')",
  );
}

async function husky() {
  return createFile('./.huskyrc.js', "module.exports = require('@ejhammond/jskit/configs/husky')");
}

async function semanticRelease() {
  await Promise.all([
    createFile(
      './.releaserc.js',
      "module.exports = require('@ejhammond/jskit/configs/semantic-release')",
    ),
    createFile(
      './.circleci/config.yml',
      `
version: 2
jobs:
  release:
    docker:
      - image: circleci/node:10.15
    working_directory: ~/repo

    steps:
      - checkout
      - run: yarn install
      - run: yarn release
workflows:
  version: 2
  release-workflow:
    jobs:
      - release:
          context: semantic-release
          filters:
            branches:
              only: master
        `,
    ),
  ]);

  addPackageJSONScript('release', 'jskit-release');
}

async function commitlint() {
  return createFile(
    './commitlint.config.js',
    "module.exports = require('@ejhammond/jskit/configs/commitlint')",
  );
}

async function dependabot() {
  return createFile(
    './.dependabot/config.yml',
    `
version: 1
update_configs:
  - package_manager: 'javascript'
    directory: '/'
    update_schedule: 'daily'
    commit_message:
      prefix: 'Fix'
  `,
  );
}

async function bootstrap() {
  await eslint();
  await prettier();
  await lintStaged();
  await husky();
  await semanticRelease();
  await editorConfig();
  await commitlint();
  await dependabot();

  fs.writeFileSync('./package.json', JSON.stringify(packageJSON), { encoding: 'utf8' });
}

bootstrap();
