module.exports = {
  transform: {
      "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "^.+\\.spec\\.(jsx?|tsx?)$",
  testPathIgnorePatterns: ["/lib/", "/node_modules/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  // collectCoverage: true,
  moduleNameMapper: {
    "global-utils": "<rootDir>/src/global-utils/",
    "data-strings": "<rootDir>/src/data-strings/",
    "actions": "<rootDir>/src/client/app/actions/",
    "reducers": "<rootDir>/src/client/app/reducers/",
    "client-utils": "<rootDir>/src/client/app/client-utils/",
    "components": "<rootDir>/src/client/app/components/"
  }
};