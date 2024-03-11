import type { Config } from 'jest';

const config: Config = {
    coverageReporters: ['json'],
    roots: ['<rootDir>/tests'],
    setupFiles: ['<rootDir>/tests/setupTests.ts'],
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testPathIgnorePatterns: ['<rootDir>/tests/__faker__/'],
};

export default config;
