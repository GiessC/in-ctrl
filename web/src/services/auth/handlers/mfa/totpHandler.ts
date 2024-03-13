import {
    AuthenticationDetails,
    CognitoUser,
    type CognitoUserSession,
} from 'amazon-cognito-identity-js';
import BaseHandler from '../baseHandler';
import type { MfaSetupRequest, MfaSetupResponse } from './mfaSetupHandler';

export interface TotpRequest extends MfaSetupRequest {
    totpCode: string;
}

export interface TotpResponse extends MfaSetupResponse {}

export default class TotpHandler extends BaseHandler {
    public handle(request: TotpRequest): Promise<TotpResponse> {
        return new Promise((resolve, reject) => {
            const user = new CognitoUser({
                Pool: this.userPool,
                Username: request.username,
            });
            user.authenticateUser(
                new AuthenticationDetails({
                    Username: request.username,
                    Password: request.password,
                }),
                {
                    onSuccess: (
                        session: CognitoUserSession,
                        userConfirmationNecessary?: boolean,
                    ) => {
                        resolve({
                            session,
                            userConfirmationNecessary,
                            secretCode: '',
                        });
                    },
                    onFailure: (error: unknown) => {
                        reject(error);
                    },
                    totpRequired: () => {
                        user.sendMFACode(request.totpCode, {
                            onSuccess: (
                                session: CognitoUserSession,
                                userConfirmationNecessary?: boolean,
                            ) => {
                                resolve({
                                    session,
                                    userConfirmationNecessary,
                                    secretCode: '',
                                });
                            },
                            onFailure: (error: unknown) => {
                                reject(error);
                            },
                        });
                    },
                },
            );
        });
    }
}
