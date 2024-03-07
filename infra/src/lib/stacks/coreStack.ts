import { Stack, type StackProps } from 'aws-cdk-lib';
import { UserPoolDomain } from 'aws-cdk-lib/aws-cognito';
import { type Construct } from 'constructs';
import Settings from '../config/settings';
import { AuthModule } from '../modules/auth/auth';
import NetworkModule from '../modules/network/network';

export interface CoreStackProps extends StackProps {
    settings: Settings;
}

/**
 * @description The CoreStack is the foundation of the infrastructure. It sets up modules that can be created once and used by other stacks.
 * @class CoreStack
 * @extends {Stack}
 */
export default class CoreStack extends Stack {
    constructor(scope: Construct, id: string, { settings }: CoreStackProps) {
        super(scope, id);
        const authModule = this.AddAuth(id, settings);
        this.AddNetwork(id, settings, authModule.domain);
    }

    private AddAuth(id: string, settings: Settings): AuthModule {
        return new AuthModule(this, `${id}-Auth`, {
            settings,
        });
    }

    private AddNetwork(
        id: string,
        settings: Settings,
        userPoolDomain: UserPoolDomain,
    ): NetworkModule {
        return new NetworkModule(this, `${id}-Network`, {
            settings,
            userPoolDomain,
        });
    }
}
