import {
    AuthenticationDetails,
    CognitoUser,
    type CognitoUserSession,
} from 'amazon-cognito-identity-js';
import BaseHandler from '../baseHandler';
import { type LoginRequest, type LoginResponse } from '../login/loginHandler';
import TotpHandler from './totpHandler';

export interface MfaSetupRequest extends LoginRequest {}
export interface MfaSetupResponse extends LoginResponse {
    secretCode: string;
}

export default class MfaSetupHandler extends BaseHandler {
    public handle(mfaSetupRequest: MfaSetupRequest): Promise<MfaSetupResponse> {
        return new Promise((resolve, reject) => {
            const user = new CognitoUser({
                Pool: this.userPool,
                Username: mfaSetupRequest.username,
            });
            user.authenticateUser(
                new AuthenticationDetails({
                    Username: mfaSetupRequest.username,
                    Password: mfaSetupRequest.password,
                }),
                {
                    onSuccess: (
                        session: CognitoUserSession,
                        userConfirmationNecessary?: boolean,
                    ) => {
                        user.associateSoftwareToken({
                            associateSecretCode: (secretCode: string) => {
                                resolve({
                                    session,
                                    userConfirmationNecessary,
                                    secretCode,
                                });
                            },
                            onFailure: (error: unknown) => {
                                reject(error);
                            },
                        });
                    },
                    onFailure: (error: unknown) => {
                        reject(error);
                    },
                    totpRequired: () => {
                        this.setNext(new TotpHandler());
                        this.next!.handle(mfaSetupRequest);
                    },
                },
            );
        });
    }
}
