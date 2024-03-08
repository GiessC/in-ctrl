import { UserPoolDomain } from 'aws-cdk-lib/aws-cognito';
import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { UserPoolDomainTarget } from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';
import { Settings } from '../../common/settings';

interface DomainModuleProps {
    settings: Settings;
    userPoolDomain: UserPoolDomain;
}

export default class DomainModule extends Construct {
    constructor(
        scope: Construct,
        id: string,
        { settings, userPoolDomain }: DomainModuleProps,
    ) {
        super(scope, id);

        this.createAuthARecord(
            `${id}-Auth`,
            settings.DomainSettings.HostedZoneId,
            userPoolDomain,
        );
    }

    private createAuthARecord(
        id: string,
        zoneId: string,
        userPoolDomain: UserPoolDomain,
    ): ARecord {
        const zone = HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
            hostedZoneId: zoneId,
            zoneName: userPoolDomain.domainName,
        });
        return new ARecord(this, id, {
            zone,
            target: RecordTarget.fromAlias(
                new UserPoolDomainTarget(userPoolDomain),
            ),
        });
    }
}
