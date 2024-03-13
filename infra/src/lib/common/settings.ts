import { RemovalPolicy } from 'aws-cdk-lib';
import path from 'path';
import { object, string, type Schema } from 'yup';

export class Settings {
    private static _instance?: Settings;
    readonly AwsSettings?: AwsSettings;
    readonly DomainSettings: DomainSettings;
    readonly RemovalPolicy?: RemovalPolicy;

    private constructor(
        AwsSettings: AwsSettings | undefined,
        DomainSettings: DomainSettings,
        RemovalPolicy: RemovalPolicy | undefined,
    ) {
        this.AwsSettings = AwsSettings;
        this.DomainSettings = DomainSettings;
        this.RemovalPolicy = RemovalPolicy;
    }

    public static fromJson(filename: string): Settings {
        this._instance = loadSettings(filename);
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
    readonly Profile: string;
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
            Profile: string().defined().nonNullable().required(),
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

const validateSettings = (settings: object) => {
    try {
        SCHEMA.validateSync(settings);
    } catch (error: unknown) {
        console.error(error);
        throw error;
    }
};

const loadSettings = (settingsFile: string): Settings => {
    const settingsFileLocation = path.join(process.cwd(), settingsFile);
    try {
        const settings = require(settingsFileLocation);
        validateSettings(settings);
        return settings;
    } catch (error: unknown) {
        console.error(
            `An error occured while loading settings file: ${settingsFileLocation}\n${error}\n\nExiting...`,
        );
        process.exit(1);
    }
};

export default loadSettings;
