import {
    Certificate,
    type ICertificate,
} from 'aws-cdk-lib/aws-certificatemanager';
import { HostedZone, type IHostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
import type { Settings } from '../../common/settings';

interface DomainModuleProps {
    settings: Settings;
}

export default class DomainModule extends Construct {
    private _settings: Settings;
    private _hostedZone: IHostedZone;
    private _certificate: ICertificate;

    public get hostedZone(): IHostedZone {
        return this._hostedZone;
    }

    public get certificate(): ICertificate {
        return this._certificate;
    }

    constructor(scope: Construct, id: string, { settings }: DomainModuleProps) {
        super(scope, id);
        this._settings = settings;
        this._hostedZone = HostedZone.fromLookup(
            this,
            this._settings.DomainSettings.HostedZoneId,
            {
                domainName: this._settings.DomainSettings.BaseDomainName,
                privateZone: false,
            },
        );
        this._certificate = Certificate.fromCertificateArn(
            this,
            `${id}-Cert`,
            this._settings.DomainSettings.CertificateArn,
        );
    }
}
