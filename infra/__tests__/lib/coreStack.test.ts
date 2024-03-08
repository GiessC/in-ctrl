import { App, RemovalPolicy } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import CoreStack from '../../src/lib/stacks/coreStack';
import createRandomSettings from '../__faker__/settingsFactory';

describe('coreStack', () => {
    describe('AuthModule', () => {
        it('Creates a Cognito user pool', () => {
            // Given
            const app = new App();

            // When
            const settings = createRandomSettings(RemovalPolicy.DESTROY);
            const coreStack = new CoreStack(app, 'TestCore', {
                settings,
            });
            const template = Template.fromStack(coreStack);

            // Then
            template.hasResourceProperties('AWS::Cognito::UserPool', {
                AccountRecoverySetting: {
                    RecoveryMechanisms: [
                        {
                            Name: 'verified_email',
                            Priority: 1,
                        },
                    ],
                },
                DeletionProtection: 'INACTIVE',
                DeviceConfiguration: {
                    ChallengeRequiredOnNewDevice: true,
                    DeviceOnlyRememberedOnUserPrompt: true,
                },
                MfaConfiguration: 'ON',
                EnabledMfas: ['SOFTWARE_TOKEN_MFA'],
                Policies: {
                    PasswordPolicy: {
                        MinimumLength: 8,
                        RequireNumbers: true,
                        RequireLowercase: true,
                        RequireSymbols: true,
                        RequireUppercase: true,
                    },
                },
                Schema: [
                    {
                        Name: 'email',
                        Required: true,
                        Mutable: true,
                    },
                ],
                UsernameConfiguration: {
                    CaseSensitive: false,
                },
            });
        });

        it('Creates a Cognito user pool client', () => {
            // Given
            const app = new App();

            // When
            const settings = createRandomSettings();
            const coreStack = new CoreStack(app, 'TestCore', {
                settings,
            });
            const template = Template.fromStack(coreStack);

            // Then
            template.hasResourceProperties('AWS::Cognito::UserPoolClient', {
                AccessTokenValidity: 60,
                AuthSessionValidity: 5,
                EnableTokenRevocation: true,
                ExplicitAuthFlows: [
                    'ALLOW_USER_SRP_AUTH',
                    'ALLOW_REFRESH_TOKEN_AUTH',
                ],
                IdTokenValidity: 60,
                PreventUserExistenceErrors: 'ENABLED',
                RefreshTokenValidity: 1440,
                SupportedIdentityProviders: ['COGNITO'],
            });
        });

        it('Creates a Cognito user pool domain', () => {
            // Given
            const app = new App();

            // When
            const settings = createRandomSettings();
            const coreStack = new CoreStack(app, 'TestCore', {
                settings,
            });
            const template = Template.fromStack(coreStack);

            // Then
            template.hasResourceProperties('AWS::Cognito::UserPoolDomain', {
                CustomDomainConfig: {
                    CertificateArn: settings.DomainSettings.CertificateArn,
                },
                Domain: 'auth.inctrl.tech',
            });
        });
    });

    describe('DomainModule', () => {
        it('Creates Route53 ARecord for Cognito domain', () => {
            // Given
            const app = new App();

            // When
            const settings = createRandomSettings();
            const coreStack = new CoreStack(app, 'TestCore', {
                settings,
            });
            const template = Template.fromStack(coreStack);

            // Then
            template.hasResourceProperties('AWS::Route53::RecordSet', {
                Type: 'A',
                HostedZoneId: settings.DomainSettings.HostedZoneId,
            });
        });
    });
});
