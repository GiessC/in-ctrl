import type { Config } from 'jest';

const config: Config = {
    coverageReporters: ['json'],
    roots: ['<rootDir>/__tests__'],
    setupFiles: ['<rootDir>/__tests__/setupTests.ts'],
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
};

export default config;
