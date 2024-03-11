export default class StackCreationFailureError extends Error {
    constructor(stackName: string, reason?: string, cause?: string) {
        let message = `Failed to create stack: ${stackName}.`;
        message += reason ? ` Reason: ${reason}` : '';
        message += cause ? ` Module: ${cause}.` : '';

        super(message);
    }
}
