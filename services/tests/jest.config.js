module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: [
    '**/tests/**/*.test.ts',
    '**/tests/**/*.spec.ts',
    '**/__tests__/**/*.ts'
  ],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        moduleResolution: 'node',
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        strict: true
      }
    }]
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/../$1',
    '^@services/(.*)$': '<rootDir>/../$1',
    '^@mocks/(.*)$': '<rootDir>/mocks/$1'
  },
  collectCoverageFrom: [
    '../**/*.{ts,tsx}',
    '!../**/*.d.ts',
    '!../**/node_modules/**',
    '!../**/.next/**',
    '!../**/dist/**',
    '!../**/coverage/**'
  ],
  coverageThresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  setupFilesAfterEnv: ['<rootDir>/setup.ts'],
  testTimeout: 30000,
  maxWorkers: '50%',
  verbose: true,
  bail: false,
  errorOnDeprecated: true,
  clearMocks: true,
  restoreMocks: true
};