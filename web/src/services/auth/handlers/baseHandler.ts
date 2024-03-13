import { settings } from '@/app/config/settings';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import AuthorizationHandler from './authorizationHandler';
import type { LoginRequest, LoginResponse } from './login/loginHandler';

export default abstract class BaseHandler
    implements AuthorizationHandler<LoginRequest, LoginResponse>
{
    protected next: BaseHandler | null = null;
    protected userPool: CognitoUserPool;

    constructor(next: BaseHandler | null = null) {
        this.next = next;
        this.userPool = new CognitoUserPool({
            ClientId: settings.Cognito.ClientId,
            UserPoolId: settings.Cognito.UserPoolId,
        });
    }

    public setNext(handler: BaseHandler): void {
        this.next = handler;
    }

    public abstract handle(request: LoginRequest): Promise<LoginResponse>;
}
