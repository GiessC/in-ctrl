import { Stack } from 'aws-cdk-lib';
import { type IHostedZone } from 'aws-cdk-lib/aws-route53';
import { type Construct } from 'constructs';
import type DefaultStackProps from '../common/defaultStackProps';
import { type Settings } from '../common/settings';
import DomainModule from '../modules/domain/domain';
import WebModule from '../modules/web/web';

/**
 * @description The CoreStack is the foundation of the infrastructure. It sets up modules that can be created once and used by other stacks.
 * @class CoreStack
 * @extends {Stack}
 */
export default class CoreStack extends Stack {
    private readonly _domainModule: DomainModule;

    public get domainModule(): DomainModule {
        return this._domainModule;
    }

    constructor(
        scope: Construct,
        id: string,
        { settings, environment, ...props }: DefaultStackProps,
    ) {
        super(scope, id, props);
        this._domainModule = this.addDomainModule(id, settings);
        const webModule = this.addWebModule(
            id,
            this._domainModule.hostedZone,
            environment,
            settings,
        );
        webModule.node.addDependency(this._domainModule);
    }

    private addWebModule(
        id: string,
        hostedZone: IHostedZone,
        environment: string,
        settings: Settings,
    ): WebModule {
        return new WebModule(this, `${id}-Web`, {
            certificateArn: settings.DomainSettings.CertificateArn,
            hostedZone,
            environment,
            settings,
        });
    }

    private addDomainModule(id: string, settings: Settings): DomainModule {
        return new DomainModule(this, `${id}-Domain`, {
            settings,
        });
    }
}
