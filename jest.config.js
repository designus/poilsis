module.exports = {
  transform: {
      "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "^.+\\.spec\\.(jsx?|tsx?)$",
  testPathIgnorePatterns: ["/lib/", "/node_modules/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleDirectories: ['node_modules', '.', 'src'],
  setupFiles: ['<rootDir>/testSetup.js'],
  moduleNameMapper: {
    "global-utils": "<rootDir>/src/global-utils/",
    "data-strings": "<rootDir>/src/data-strings/",
    "actions": "<rootDir>/src/client/app/actions/",
    "reducers": "<rootDir>/src/client/app/reducers/",
    "^(client-utils/.+)$": "<rootDir>/src/client/app/$1",
    "^(components/.+)$": "<rootDir>/src/client/app/components/$1",
    "pages": "<rootDir>/src/client/app/pages/"
  },
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json'
    }
  }
};
