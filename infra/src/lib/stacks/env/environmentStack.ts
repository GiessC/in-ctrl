import { Environment, Stack } from 'aws-cdk-lib';
import { type Settings } from '../../common/settings';
import CoreStack from '../coreStack';

export default abstract class EnvironmentStack extends Stack {
    protected createStacks(environment: string, awsEnv?: Environment): void {
        this.createCoreStack(environment, awsEnv);
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

    protected getEnv(settings: Settings): Environment {
        return {
            account: settings.AwsSettings?.Account,
            region: settings.AwsSettings?.Region,
        };
    }

    protected abstract get settings(): Settings;
}
