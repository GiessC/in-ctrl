import { Duration, RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib';
import {
    AccountRecovery,
    Mfa,
    UserPool,
    UserPoolClientIdentityProvider,
    VerificationEmailStyle,
} from 'aws-cdk-lib/aws-cognito';
import { type Construct } from 'constructs';
import type Settings from '../config/Settings';

export interface AuthStackProps extends StackProps {
    readonly settings: Settings;
}

export class AuthStack extends Stack {
    constructor(scope: Construct, id: string, props?: AuthStackProps) {
        super(scope, id, props);
        const settings = props?.settings;
        this.CreateUserPool(id, settings?.removalPolicy);
    }

    private CreateUserPool(
        id: string,
        removalPolicy: RemovalPolicy = RemovalPolicy.DESTROY,
    ) {
        const userPool = new UserPool(this, `${id}-InControl-Users`, {
            accountRecovery: AccountRecovery.EMAIL_ONLY,
            deletionProtection: removalPolicy !== RemovalPolicy.DESTROY,
            deviceTracking: {
                challengeRequiredOnNewDevice: true,
                deviceOnlyRememberedOnUserPrompt: true,
            },
            mfa: Mfa.REQUIRED,
            mfaMessage: 'Your MFA verification code for InControl is {####}',
            mfaSecondFactor: {
                otp: true,
                sms: false,
            },
            passwordPolicy: {
                minLength: 8,
                requireDigits: true,
                requireLowercase: true,
                requireSymbols: true,
                requireUppercase: true,
            },
            removalPolicy,
            selfSignUpEnabled: true,
            signInAliases: {
                email: true,
                username: true,
            },
            signInCaseSensitive: false,
            standardAttributes: {
                email: {
                    required: true,
                    mutable: true,
                },
            },
            userVerification: {
                emailSubject: 'Welcome to InControl! Email Verification',
                emailBody:
                    "Hello {username},\n\nWe're happy to have you join InControl! Verify your account by clicking on {##Verify Email##}",
                emailStyle: VerificationEmailStyle.LINK,
            },
        });
        userPool.addClient(`${id}-InControl-Users-Client`, {
            accessTokenValidity: Duration.hours(1),
            authFlows: {
                userSrp: true,
                adminUserPassword: false,
                custom: false,
                userPassword: false,
            },
            authSessionValidity: Duration.minutes(5),
            enableTokenRevocation: true,
            idTokenValidity: Duration.hours(1),
            preventUserExistenceErrors: true,
            refreshTokenValidity: Duration.days(1),
            supportedIdentityProviders: [
                UserPoolClientIdentityProvider.COGNITO,
            ],
        });
    }
}
