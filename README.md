# TrippKit

Common configurations and scripts for my js/ts projects

> Disclaimer: This is really only built for personal use. I suggest forking and using it as inspiration if you like what's going on. I make no guarantees about breaking changes etc.

## Install

```bash
yarn add -D trippkit
```

## Commit Message Convention

We enforce a commit-message convention so that we can automatically create releases with nice release notes and deterministic version-bumps.

For simplicity, there are only 4 types of commits and they correspond directly to the type of version-bump that would be required.

- Internal - some internal change that has no bearing on the exported artifacts / app (no version bump, no release)
- Fix - a non-breaking bug fix (patch version bump, release)
- New - a non-breaking new feature (minor version bump, release)
- Breaking - a breaking change (major version bump, release)

e.g.

> Internal: Update readme

> Fix: Check for null before executing logic

> New: Add Carousel component

> Breaking: Remove bad API, add new API

## Eslint

Enforce code quality best-practices

```js
// .eslintrc.js

module.exports = {
  extends: [
    require.resolve('trippkit/configs/eslint-config-react'),
    // or
    require.resolve('trippkit/configs/eslint-config-node'),
  ],
};
```

```json
// package.json

{
  ...
  "scripts": {
    ...
    "lint": "tk-lint"
  }
}
```

## Prettier

Enable automatic code formatting

```js
// .prettierrc.js

module.exports = require('trippkit/configs/prettier');
```

```json
// package.json

{
  ...
  "scripts": {
    ...
    "format": "tk-format"
  }
}
```

## EditorConfig

Configure the editor to use the proper formatting by default

There's no way to "extend" an EditorConfig, so just copy/paste this content into a file called `.editorconfig`
[Issue](https://github.com/editorconfig/editorconfig/issues/236)

```txt
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
```

## Semantic Release

Configure automated releases based on commit message

### Setup

#### Env

The release process:

1. Analyze commits to determine the next version number
2. Write new version number to package.json
3. Commit the version bump and tag that commit with the version
4. Push that commit to GitHub
5. Generate release notes based on the commit messages
6. Publish the release notes on GitHub
7. Publish the library on NPM

In order for this to work, we need write-access to GitHub and NPM. Therefore, `GITHUB_TOKEN` and `NPM_TOKEN` env variables must be defined in order for the release to work. You can add a `.env` file at the root of your project (remember to .gitignore!) if you want to publish locally. The env vars must be defined in the CI environment if you want CI to release.

```
// .env

// don't forget to .gitignore this file!

GITHUB_TOKEN = abcdefghijklmnopqrstuvwxyz
NPM_TOKEN = abcdefghijklmnopqrstuvwxyz
```

#### Config

```js
// release.config.js

module.exports = require('trippkit/configs/semantic-release');
```

#### Script

In the package.json, you can call `tk-release` in order to kick off the release process

```json
// package.json

{
  ...
  "scripts": {
    ...
    "build": "your build script",
    "test": "your test script",
    "release": "yarn build && yarn test && tk-release"
  }
}
```

## Lint-Staged

Enables us to run our auto-formatter and linter on staged files

```js
// lint-staged.config.js

module.exports = require('trippkit/configs/lint-staged');
```

## Husky

Runs the auto-formatter and linter on staged files before commits. Also validates that the commit follows our commit message convention

```js
//.huskyrc.js

module.exports = require('trippkit/configs/husky');
```
