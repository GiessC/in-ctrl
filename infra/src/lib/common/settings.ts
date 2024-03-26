import { RemovalPolicy } from 'aws-cdk-lib';
import path from 'path';
import { object, string, type Schema } from 'yup';

interface FileSettings extends Record<string, unknown> {
    AwsSettings?: Record<string, unknown>;
    DomainSettings: Record<string, unknown>;
    RemovalPolicy?: Record<string, unknown>;
}

export interface ISettings {
    AwsSettings?: AwsSettings;
    DomainSettings: DomainSettings;
    RemovalPolicy?: RemovalPolicy;
}

export class Settings implements ISettings {
    private static _instance?: Settings;
    readonly DomainSettings: DomainSettings;
    readonly AwsSettings?: AwsSettings;
    readonly RemovalPolicy?: RemovalPolicy;

    protected constructor({
        DomainSettings,
        AwsSettings,
        RemovalPolicy,
    }: ISettings) {
        this.DomainSettings = DomainSettings;
        this.AwsSettings = AwsSettings;
        this.RemovalPolicy = RemovalPolicy;
    }

    public static fromISettings(settings: ISettings): Settings {
        return new Settings(settings);
    }

    public static fromJson(environment: string, filename: string): Settings {
        this._instance = loadSettings(environment, filename);
        return this._instance;
    }

    public static get instance(): Settings {
        if (!this._instance) {
            throw new Error('Settings not loaded');
        }
        return this._instance;
    }
}

export interface AwsSettings {
    readonly Account: string;
    readonly Region: string;
}

export interface DomainSettings {
    readonly CertificateArn: string;
    readonly HostedZoneId: string;
    readonly BaseDomainName: string;
    readonly DomainName: string;
}

const SCHEMA: Schema = object<Settings>().shape({
    AwsSettings: object<AwsSettings>()
        .shape({
            Account: string().defined().nonNullable().required(),
            Region: string().defined().nonNullable().required(),
        })
        .optional()
        .notRequired(),
    DomainSettings: object<DomainSettings>()
        .shape({
            CertificateArn: string().defined().nonNullable().required(),
            HostedZoneId: string().defined().nonNullable().required(),
            BaseDomainName: string().defined().nonNullable().required(),
            DomainName: string().defined().nonNullable().required(),
        })
        .defined()
        .nonNullable()
        .required(),
    RemovalPolicy: string()
        .optional()
        .notRequired()
        .oneOf([
            RemovalPolicy.DESTROY,
            RemovalPolicy.RETAIN,
            RemovalPolicy.SNAPSHOT,
            RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE,
        ]),
});

const validateSettings = (settings: Record<string, unknown>) => {
    try {
        SCHEMA.validateSync(settings);
    } catch (error: unknown) {
        console.error(error);
        throw error;
    }
};

const loadSettings = (environment: string, settingsFile: string): Settings => {
    const settingsFileLocation = path.join(process.cwd(), settingsFile);
    try {
        const settings: FileSettings = require(settingsFileLocation);
        settings.DomainSettings.DomainName =
            environment === 'prod'
                ? settings.DomainSettings.BaseDomainName
                : `${environment.toLowerCase()}.${
                      settings.DomainSettings.BaseDomainName
                  }`;
        validateSettings(settings);
        return Settings.fromISettings(settings as unknown as ISettings);
    } catch (error: unknown) {
        console.error(
            `An error occured while loading settings file: ${settingsFileLocation}\n${error}\n\nExiting...`,
        );
        process.exit(1);
    }
};

export default loadSettings;
