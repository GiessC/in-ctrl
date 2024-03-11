import { Stack } from 'aws-cdk-lib';
import { type IDistribution } from 'aws-cdk-lib/aws-cloudfront';
import { type UserPoolDomain } from 'aws-cdk-lib/aws-cognito';
import { type Construct } from 'constructs';
import type DefaultStackProps from '../common/defaultStackProps';
import { type Settings } from '../common/settings';
import { AuthModule } from '../modules/auth/auth';
import DomainModule from '../modules/domain/domain';
import WebModule from '../modules/web/web';

/**
 * @description The CoreStack is the foundation of the infrastructure. It sets up modules that can be created once and used by other stacks.
 * @class CoreStack
 * @extends {Stack}
 */
export default class CoreStack extends Stack {
    constructor(
        scope: Construct,
        id: string,
        { settings, ...props }: DefaultStackProps,
    ) {
        super(scope, id, props);
        const authModule = this.addAuthModule(id, settings);
        const webModule = this.addWebModule(id, settings);
        this.addDomainModule(
            id,
            webModule.distribution,
            authModule.domain,
            settings,
        );
    }

    private addAuthModule(id: string, settings: Settings): AuthModule {
        return new AuthModule(this, `${id}-Auth`, {
            settings,
        });
    }

    private addWebModule(id: string, settings: Settings): WebModule {
        return new WebModule(this, `${id}-Web`, {
            certificateArn: settings.DomainSettings.CertificateArn,
            settings,
        });
    }

    private addDomainModule(
        id: string,
        distribution: IDistribution,
        userPoolDomain: UserPoolDomain,
        settings: Settings,
    ): DomainModule {
        return new DomainModule(this, `${id}-Domain`, {
            distribution,
            userPoolDomain,
            settings,
        });
    }
}
