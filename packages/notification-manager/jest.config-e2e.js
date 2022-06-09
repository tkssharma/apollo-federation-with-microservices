// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  "setupFiles": ["./test/setEnvVars.js"],
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  maxWorkers: 1,
  testEnvironment: "node",
  testRegex: ".e2e-spec.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  moduleNameMapper: {
    "^@config(.*)$": "<rootDir>/src/config/$1",
    "^@app(.*)$": "<rootDir>/src/app/$1",
    "^@domain(.*)$": "<rootDir>/src/app/domain/$1",
    "^@events(.*)$": "<rootDir>/src/events/$1",
    "^@core(.*)$": "<rootDir>/src/app/core/$1",
    "^@shared(.*)$": "<rootDir>/src/app/shared/$1",
    "^@logging(.*)$": "<rootDir>/src/logging/$1",
    "^@storage(.*)$": "<rootDir>/src/storage/$1",
    "^@test(.*)$": "<rootDir>/test/$1",
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.e2e.json",
    },
  },
};
