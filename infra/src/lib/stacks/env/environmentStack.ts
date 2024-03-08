import { Stack } from 'aws-cdk-lib';
import { Settings } from '../../common/settings';
import CoreStack from '../coreStack';

export default abstract class EnvironmentStack extends Stack {
    protected createStacks(): void {
        this.createCoreStack();
    }

    private createCoreStack(): void {
        new CoreStack(this, 'Core', {
            settings: this.settings,
        });
    }

    protected abstract get settings(): Settings;
}
