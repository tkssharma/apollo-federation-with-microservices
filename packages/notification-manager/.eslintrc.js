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
    "unused-imports/no-unused-imports-ts": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/ban-types": "off",
    // allow common js imports as some deps are still with common-js 
    "@typescript-eslint/no-var-requires": 0,
    "no-useless-escape": 0,
    "no-case-declarations": 0,
    "no-empty": 0,
    // this is for regex, it will throw for regex characters
    "no-useless-catch": 0,
    "@typescript-eslint/no-empty-function": 0,
    "no-console": 0,
    // this i have to add as we mostly use rollbar to catch error 
    "@typescript-eslint/no-explicit-any": 0,
    // this is needed as we assign things from process.env which may be null | undefined | string 
    // and we have explicitly this.configService.get().azure.fileUpload.containerName!
    "@typescript-eslint/no-non-null-assertion": 0,
    "no-async-promise-executor": 0

  }
};
