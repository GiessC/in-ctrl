import { type StackProps } from 'aws-cdk-lib';
import { type Construct } from 'constructs';
import loadSettings, { type Settings } from '../../../common/settings';
import EnvironmentStack from '../environmentStack';

export default class ProductionStack extends EnvironmentStack {
    private static readonly SETTINGS_FILE = 'settings.json';
    private readonly _settings: Settings;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        this._settings = loadSettings('prod', ProductionStack.SETTINGS_FILE);
        const env = this.getEnv(this._settings);
        this.createStacks('prod', env);
    }

    protected get settings(): Settings {
        return this._settings;
    }
}
