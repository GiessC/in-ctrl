import { type App } from 'aws-cdk-lib';
import { config } from 'dotenv';
import type Settings from '../../lib/config/settings';
import { requiredKeys } from '../../lib/config/settings';
import EnvironmentFailureError from '../../lib/errors/environmentFailureError';
import MissingEnvironmentVariableError from '../../lib/errors/missingEnvironmentVariableError';

export type Environment = 'local' | 'development' | 'production';

const getEnvironment = (app: App): Environment => {
    const environment = app.node.tryGetContext('environment');
    if (!environment || ['development', 'production'].includes(environment)) {
        return (environment as Environment) ?? 'development';
    }
    return 'local';
};

export const loadSettings = (app: App): Settings => {
    const environment = getEnvironment(app);
    console.info('Using environment:', environment);
    const { parsed } = config();
    if (!parsed) {
        throw new EnvironmentFailureError(environment);
    }
    for (const key of Object.keys(parsed)) {
        if (requiredKeys.includes(key) && !parsed[key]) {
            throw new MissingEnvironmentVariableError(key);
        }
    }

    return parsed as Settings;
};
