import { type StackProps } from 'aws-cdk-lib';
import { type Construct } from 'constructs';
import loadSettings, { type Settings } from '../../../common/settings';
import EnvironmentStack from '../environmentStack';

export default class LocalStack extends EnvironmentStack {
    private static readonly SETTINGS_FILE = 'settings.local.json';
    private readonly _settings: Settings;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        this._settings = loadSettings(LocalStack.SETTINGS_FILE);
        console.info(this._settings);
        this.createStacks(props?.env);
    }

    protected get settings(): Settings {
        return this._settings;
    }
}
