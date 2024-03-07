export default class MissingEnvironmentVariableError extends Error {
    constructor(key?: string) {
        super(
            key
                ? `Missing environment variable: ${key}.`
                : 'Missing environment variable.',
        );
    }
}
