import '@testing-library/jest-dom';

export default {
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.js']
};