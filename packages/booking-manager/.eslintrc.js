module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "rules": {
    // strict https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-module-boundary-types.md
    // strict which we may not be able to adopt
    "@typescript-eslint/explicit-module-boundary-types": 0,
    // allow common js imports as some deps are still with common-js 
    "@typescript-eslint/no-var-requires": 0,
    "no-useless-escape": 0,
    // this is for regex, it will throw for regex characters
    "no-useless-catch": 0,
    // this i have to add as we mostly use rollbar to catch error 
    "@typescript-eslint/no-explicit-any": 0,
    // this is needed as we assign things from process.env which may be null | undefined | string 
    // and we have explicitly this.configService.get().azure.fileUpload.containerName!
    "@typescript-eslint/no-non-null-assertion": 0,
    "no-async-promise-executor": 0
  }
};