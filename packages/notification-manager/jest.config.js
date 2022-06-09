module.exports = {
  "setupFiles": [
    "<rootDir>/test/setEnvVars.js"
  ],
  "moduleFileExtensions": [
    "js",
    "ts"
  ],
  "rootDir": ".",
  "testRegex": "[.]spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "coverageDirectory": "./coverage",
  "testEnvironment": "node",
  "roots": [
    "<rootDir>/"
  ],
  moduleNameMapper: {
    "^@config(.*)$": "<rootDir>/src/config/$1",
    "^@app(.*)$": "<rootDir>/src/app/$1",
    "^@auth(.*)$": "<rootDir>/src/auth/$1",
    "^@domain(.*)$": "<rootDir>/src/app/domain/$1",
    "^@events(.*)$": "<rootDir>/src/events/$1",
    "^@core(.*)$": "<rootDir>/src/app/core/$1",
    "^@shared(.*)$": "<rootDir>/src/app/shared/$1",
    "^@logging(.*)$": "<rootDir>/src/logging/$1",
    "^@storage(.*)$": "<rootDir>/src/storage/$1",
    "^@test(.*)$": "<rootDir>/test/$1",

  },
}