import { Duration, RemovalPolicy } from 'aws-cdk-lib';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import {
    AccountRecovery,
    Mfa,
    UserPool,
    UserPoolClient,
    UserPoolClientIdentityProvider,
    UserPoolDomain,
    VerificationEmailStyle,
} from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';
import DefaultModuleProps from '../../common/defaultModuleProps';

export class AuthModule extends Construct {
    public readonly userPool: UserPool;
    public readonly client: UserPoolClient;
    public readonly domain: UserPoolDomain;

    constructor(scope: Construct, id: string, props: DefaultModuleProps) {
        super(scope, id);
        const settings = props?.settings;
        this.userPool = this.createUserPool(id, settings.RemovalPolicy);
        this.client = this.createUserPoolClient(id);
        this.domain = this.createUserPoolDomain(
            id,
            settings.DomainSettings.CertificateArn,
        );
    }

    private createUserPool(
        id: string,
        removalPolicy: RemovalPolicy = RemovalPolicy.DESTROY,
    ): UserPool {
        return new UserPool(this, `${id}-Users`, {
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
    }

    private createUserPoolClient(id: string) {
        return new UserPoolClient(this, `${id}-Client`, {
            userPool: this.userPool,
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

    private createUserPoolDomain(id: string, certificateArn: string) {
        return new UserPoolDomain(this, `${id}-Domain`, {
            userPool: this.userPool,
            customDomain: {
                domainName: 'auth.inctrl.tech',
                certificate: Certificate.fromCertificateArn(
                    this,
                    'InControl-Certificate',
                    certificateArn,
                ),
            },
        });
    }
}
