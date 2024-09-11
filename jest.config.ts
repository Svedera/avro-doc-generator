import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    'node_modules/variables/.+\\.(j|t)sx?$': 'ts-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!variables/.*)'
  ],
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
    '^@services/(.*)$': '<rootDir>/src/app/core/services/$1',
    '^@models/(.*)$': '<rootDir>/src/app/core/models/$1',
    '^@interfaces/(.*)$': '<rootDir>/src/app/core/interfaces/$1',
    '^@enums/(.*)$': '<rootDir>/src/app/core/enums/$1',
    '^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
  }
};

export default config;