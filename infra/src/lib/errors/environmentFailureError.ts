export default class EnvironmentFailureError extends Error {
    constructor(environment?: string) {
        super(
            environment
                ? `Failed to load environment: ${environment}.`
                : 'Failed to load environment. Did you forget to provide "-c environment=..." to "cdk deploy ..."?',
        );
    }
}
