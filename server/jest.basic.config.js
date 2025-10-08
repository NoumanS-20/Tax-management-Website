module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/basic.test.js', '**/tests/health-simple.test.js'],
  verbose: true,
  testTimeout: 5000,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
};
