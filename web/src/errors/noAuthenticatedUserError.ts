export default class NoAuthenticatedUserError extends Error {
    constructor() {
        super('No authenticated user found');
        this.name = 'NoAuthenticatedUserError';
    }
}
