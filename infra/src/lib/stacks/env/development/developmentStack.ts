import { StackProps } from 'aws-cdk-lib';
import { type Construct } from 'constructs';
import { Settings } from '../../../common/settings';
import EnvironmentStack from '../environmentStack';

export default class DevelopmentStack extends EnvironmentStack {
    private static readonly SETTINGS_FILE = 'settings.development.json';
    private readonly _settings: Settings;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        this._settings = Settings.fromJson(DevelopmentStack.SETTINGS_FILE);
        const env = this.getEnv(this._settings);
        this.createStacks(env);
    }

    protected get settings(): Settings {
        return this._settings;
    }
}
