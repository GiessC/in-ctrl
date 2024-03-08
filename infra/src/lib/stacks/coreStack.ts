import { Stack } from 'aws-cdk-lib';
import { UserPoolDomain } from 'aws-cdk-lib/aws-cognito';
import { type Construct } from 'constructs';
import type DefaultStackProps from '../common/defaultStackProps';
import { type Settings } from '../common/settings';
import { AuthModule } from '../modules/auth/auth';
import DomainModule from '../modules/domain/domain';

/**
 * @description The CoreStack is the foundation of the infrastructure. It sets up modules that can be created once and used by other stacks.
 * @class CoreStack
 * @extends {Stack}
 */
export default class CoreStack extends Stack {
    constructor(scope: Construct, id: string, { settings }: DefaultStackProps) {
        super(scope, id);
        const authModule = this.addAuth(id, settings);
        this.addNetwork(id, settings, authModule.domain);
    }

    private addAuth(id: string, settings: Settings): AuthModule {
        return new AuthModule(this, `${id}-Auth`, {
            settings,
        });
    }

    private addNetwork(
        id: string,
        settings: Settings,
        userPoolDomain: UserPoolDomain,
    ): DomainModule {
        return new DomainModule(this, `${id}-Domain`, {
            settings,
            userPoolDomain,
        });
    }
}
