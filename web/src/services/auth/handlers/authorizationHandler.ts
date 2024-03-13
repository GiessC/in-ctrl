export default interface AuthorizationHandler<Request, Response> {
    setNext(handler: AuthorizationHandler<Request, Response>): void;
    handle(request: Request): Promise<Response>;
}
