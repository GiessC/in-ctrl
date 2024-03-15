import { type StackProps } from 'aws-cdk-lib';
import { type Construct } from 'constructs';
import loadSettings, { type Settings } from '../../../common/settings';
import EnvironmentStack from '../environmentStack';

export interface LocalStackProps extends StackProps {
    _environment?: string;
}

export default class LocalStack extends EnvironmentStack {
    private static readonly SETTINGS_FILE = 'settings.local.json';
    private readonly _settings: Settings;

    constructor(
        scope: Construct,
        id: string,
        { _environment: environment, ...props }: LocalStackProps,
    ) {
        super(scope, id, props);
        if (!environment)
            throw new Error('Environment not provided to LocalStack');
        this._settings = loadSettings(environment, LocalStack.SETTINGS_FILE);
        const env = this.getEnv(this._settings);
        this.createStacks(environment, env);
    }

    protected get settings(): Settings {
        return this._settings;
    }
}
