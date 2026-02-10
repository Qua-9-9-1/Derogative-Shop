/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 20,
      lines: 20,
      statements: 20,
    },
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/app.ts', '!src/**/*.d.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
