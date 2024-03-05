import type { Config } from 'jest';

const config: Config = {
    coverageReporters: ['json'],
    roots: ['<rootDir>/test'],
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
};

export default config;
