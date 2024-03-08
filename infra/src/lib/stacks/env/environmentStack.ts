import { Environment, Stack } from 'aws-cdk-lib';
import { type Settings } from '../../common/settings';
import CoreStack from '../coreStack';

export default abstract class EnvironmentStack extends Stack {
    protected createStacks(awsEnv?: Environment): void {
        this.createCoreStack(awsEnv);
    }

    private createCoreStack(awsEnv?: Environment): void {
        new CoreStack(this, 'Core', {
            env: awsEnv,
            settings: this.settings,
        });
    }

    protected abstract get settings(): Settings;
}
