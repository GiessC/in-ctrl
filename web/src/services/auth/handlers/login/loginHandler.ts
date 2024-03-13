import {
    AuthenticationDetails,
    CognitoUser,
    type CognitoUserSession,
} from 'amazon-cognito-identity-js';
import BaseHandler from '../baseHandler';
import MfaSetupHandler from '../mfa/mfaSetupHandler';
import TotpHandler from '../mfa/totpHandler';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    session: CognitoUserSession;
    userConfirmationNecessary?: boolean;
}

export default class LoginHandler extends BaseHandler {
    public async handle(loginRequest: LoginRequest): Promise<LoginResponse> {
        return new Promise((resolve, reject) => {
            const user = new CognitoUser({
                Pool: this.userPool,
                Username: loginRequest.username,
            });
            user.authenticateUser(
                new AuthenticationDetails({
                    Username: loginRequest.username,
                    Password: loginRequest.password,
                }),
                {
                    onSuccess: (
                        session: CognitoUserSession,
                        userConfirmationNecessary?: boolean,
                    ) => {
                        resolve({ session, userConfirmationNecessary });
                    },
                    onFailure: (error: unknown) => {
                        reject(error);
                    },
                    // TODO: Come back to these. Do we need to update anything? Does our promise propagate?
                    mfaSetup: () => {
                        this.setNext(new MfaSetupHandler(this));
                        resolve(this.next!.handle(loginRequest));
                    },
                    totpRequired: () => {
                        this.setNext(new TotpHandler(this));
                        resolve(this.next!.handle(loginRequest));
                    },
                },
            );
        });
    }
}
