import { type IDistribution } from 'aws-cdk-lib/aws-cloudfront';
import { UserPoolDomain } from 'aws-cdk-lib/aws-cognito';
import {
    ARecord,
    HostedZone,
    RecordTarget,
    type IHostedZone,
} from 'aws-cdk-lib/aws-route53';
import {
    CloudFrontTarget,
    UserPoolDomainTarget,
} from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';
import Route53Resource from '../../common/resources/route53';
import { Settings } from '../../common/settings';

interface DomainModuleProps {
    settings: Settings;
    distribution: IDistribution;
    userPoolDomain: UserPoolDomain;
}

export default class DomainModule extends Construct {
    private readonly _settings: Settings;

    constructor(
        scope: Construct,
        id: string,
        { settings, distribution, userPoolDomain }: DomainModuleProps,
    ) {
        super(scope, id);
        this._settings = settings;
        const hostedZone = HostedZone.fromLookup(
            this,
            settings.DomainSettings.HostedZoneId,
            {
                domainName: settings.DomainSettings.DomainName,
                privateZone: false,
            },
        );
        this.createWebARecord(`${id}-Web`, hostedZone, distribution);
        this.createAuthRoute53Records(`${id}-Auth`, hostedZone, userPoolDomain);
    }

    private createWebARecord(
        id: string,
        hostedZone: IHostedZone,
        distribution: IDistribution,
    ): ARecord {
        return Route53Resource.createARecord(this, `${id}-A`, {
            target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
            zone: hostedZone,
        });
    }

    private createAuthRoute53Records(
        id: string,
        hostedZone: IHostedZone,
        userPoolDomain: UserPoolDomain,
    ): void {
        Route53Resource.createARecord(this, `${id}-A`, {
            target: RecordTarget.fromAlias(
                new UserPoolDomainTarget(userPoolDomain),
            ),
            zone: hostedZone,
            recordName: 'auth',
        });
    }
}
