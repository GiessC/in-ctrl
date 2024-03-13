import { App, RemovalPolicy } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import CoreStack from '../../../src/lib/stacks/domainStack';
import createRandomSettings from '../../__faker__/settingsFactory';

jest.mock('aws-cdk-lib/aws-route53');

describe('CoreStack', () => {
    it('Creates Auth module', () => {
        // Given
        const id = 'test';
        const app = new App();
        const settings = createRandomSettings();

        // When
        const stack = new CoreStack(app, id, {
            settings,
        });
        const template = Template.fromStack(stack);

        // Then
        template.hasResourceProperties('AWS::Cognito::UserPool', {
            AccountRecoverySetting: {
                RecoveryMechanisms: [
                    {
                        Name: 'verified_email',
                    },
                ],
            },
            AliasAttributes: ['email'],
            DeletionProtection:
                settings.RemovalPolicy === RemovalPolicy.DESTROY
                    ? 'INACTIVE'
                    : 'ACTIVE',
            DeviceConfiguration: {
                ChallengeRequiredOnNewDevice: true,
                DeviceOnlyRememberedOnUserPrompt: true,
            },
            EnabledMfas: ['SOFTWARE_TOKEN_MFA'],
            VerificationMessageTemplate: {
                EmailMessageByLink:
                    "We're glad you're joining InCtrl! Please verify your email by clicking {##Verify Email##}",
                EmailSubjectByLink: 'Welcome to InCtrl! Email Verification',
            },
            MfaConfiguration: 'ON',
            Policies: {
                PasswordPolicy: {
                    MinimumLength: 8,
                    RequireLowercase: true,
                    RequireNumbers: true,
                    RequireSymbols: true,
                    RequireUppercase: true,
                },
            },
            UsernameConfiguration: {
                CaseSensitive: false,
            },
        });
        template.hasResourceProperties('AWS::Cognito::UserPoolClient', {
            AccessTokenValidity: 60,
            AllowedOAuthFlows: ['implicit', 'code'],
            AllowedOAuthFlowsUserPoolClient: true,
            AllowedOAuthScopes: [
                'profile',
                'phone',
                'email',
                'openid',
                'aws.cognito.signin.user.admin',
            ],
            AuthSessionValidity: 5,
            CallbackURLs: ['https://localhost'],
            IdTokenValidity: 60,
            PreventUserExistenceErrors: 'ENABLED',
            RefreshTokenValidity: 1440,
            SupportedIdentityProviders: ['COGNITO'],
            TokenValidityUnits: {
                AccessToken: 'minutes',
                IdToken: 'minutes',
                RefreshToken: 'minutes',
            },
        });
        template.hasResourceProperties('AWS::Cognito::UserPoolDomain', {
            CustomDomainConfig: {
                CertificateArn: settings.DomainSettings.CertificateArn,
            },
            Domain: `auth.${settings.DomainSettings.DomainName}`,
        });
    });
});
