export default interface Settings {
    Cognito: CognitoSettings;
}

export interface CognitoSettings {
    UserPoolId: string;
    ClientId: string;
}

// TODO: Validate these settings and throw error if it fails
export const settings: Settings = {
    Cognito: {
        UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID ?? '',
        ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID ?? '',
    },
};
