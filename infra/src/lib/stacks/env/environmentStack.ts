import { Environment, Stack } from 'aws-cdk-lib';
import type { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import type { IHostedZone } from 'aws-cdk-lib/aws-route53';
import { type Settings } from '../../common/settings';
import AuthStack from '../authStack';
import CoreStack from '../coreStack';

export default abstract class EnvironmentStack extends Stack {
    protected createStacks(environment: string, awsEnv?: Environment): void {
        const coreStack = this.createCoreStack(environment, awsEnv);
        const authStack = this.createAuthStack(
            coreStack.domainModule.certificate,
            coreStack.domainModule.hostedZone,
            awsEnv,
        );
        authStack.node.addDependency(coreStack);
    }

    private createCoreStack(
        environment: string,
        awsEnv?: Environment,
    ): CoreStack {
        return new CoreStack(this, 'Core', {
            env: awsEnv,
            environment,
            settings: this.settings,
        });
    }

    private createAuthStack(
        certificate: ICertificate,
        hostedZone: IHostedZone,
        awsEnv?: Environment,
    ): AuthStack {
        return new AuthStack(this, 'Auth', {
            env: awsEnv,
            environment: this.environment,
            settings: this.settings,

            certificate,
            hostedZone,
        });
    }

    protected getEnv(settings: Settings): Environment {
        return {
            account: settings.AwsSettings?.Account,
            region: settings.AwsSettings?.Region,
        };
    }

    protected abstract get settings(): Settings;
}
