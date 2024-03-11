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
import { type Settings } from '../../common/settings';

export class AuthModule extends Construct {
    private readonly _settings: Settings;
    public readonly userPool: UserPool;
    public readonly client: UserPoolClient;
    public readonly domain: UserPoolDomain;

    constructor(scope: Construct, id: string, props: DefaultModuleProps) {
        super(scope, id);
        this._settings = props?.settings;
        this.userPool = this.createUserPool(id, this._settings.RemovalPolicy);
        this.client = this.createUserPoolClient(id);
        this.domain = this.createUserPoolDomain(
            id,
            this._settings.DomainSettings.CertificateArn,
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
                    "We're happy to have you join InControl! Verify your account by clicking on {##Verify Email##}",
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
            oAuth: {
                callbackUrls: ['https://localhost'],
            },
        });
    }

    private createUserPoolDomain(id: string, certificateArn: string) {
        return new UserPoolDomain(this, `${id}-Domain`, {
            userPool: this.userPool,
            customDomain: {
                domainName: `auth.${this._settings.DomainSettings.DomainName}`,
                certificate: Certificate.fromCertificateArn(
                    this,
                    `${id}-Cert`,
                    certificateArn,
                ),
            },
        });
    }
}
