import { Stack } from 'aws-cdk-lib';
import type { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { type IHostedZone } from 'aws-cdk-lib/aws-route53';
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
        const domainModule = this.addDomainModule(id, settings);
        const webModule = this.addWebModule(
            id,
            domainModule.hostedZone,
            settings,
        );
        const authModule = this.addAuthModule(
            id,
            domainModule.certificate,
            settings,
        );
        webModule.node.addDependency(domainModule);
        authModule.node.addDependency(webModule.aRecord); // Depends on A Record from web module
    }

    private addAuthModule(
        id: string,
        certificate: ICertificate,
        settings: Settings,
    ): AuthModule {
        return new AuthModule(this, `${id}-Auth`, {
            certificate,
            settings,
        });
    }

    private addWebModule(
        id: string,
        hostedZone: IHostedZone,
        settings: Settings,
    ): WebModule {
        return new WebModule(this, `${id}-Web`, {
            certificateArn: settings.DomainSettings.CertificateArn,
            hostedZone,
            settings,
        });
    }

    private addDomainModule(id: string, settings: Settings): DomainModule {
        return new DomainModule(this, `${id}-Domain`, {
            settings,
        });
    }
}
