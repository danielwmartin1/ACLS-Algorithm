export default {
  testEnvironment: 'jsdom',
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};