# TrippKit

Common configurations and scripts for my js/ts projects

## Eslint

```js
// .eslintrc.js

module.exports = {
  extends: [
    require.resolve('trippkit/configs/eslint-config-react'),
    // or
    require.resolve('trippkit/configs/eslint-config-node)
  ],
};

```

## Prettier

```js
// .prettierrc.js

module.exports = require('trippkit/configs/prettier');
```

## EditorConfig

There's no way to "extend" an EditorConfig, so just copy/paste this content into a file called `.editorconfig`
(https://github.com/editorconfig/editorconfig/issues/236)

```toml
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

Requires `GITHUB_TOKEN` and `NPM_TOKEN` env variables.

```js
// release.config.js

module.exports = require('trippkit/configs/semantic-release');
```
