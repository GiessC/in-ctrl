import { UserPoolDomain } from 'aws-cdk-lib/aws-cognito';
import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { UserPoolDomainTarget } from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';
import Settings from '../../config/settings';

interface NetworkConstructProps {
    settings: Settings;
    userPoolDomain: UserPoolDomain;
}

export default class NetworkModule extends Construct {
    constructor(
        scope: Construct,
        id: string,
        { settings, userPoolDomain }: NetworkConstructProps,
    ) {
        super(scope, id);

        this.CreateAuthARecord(
            `${id}-Auth`,
            settings.HOSTED_ZONE_ID,
            userPoolDomain,
        );
    }

    private CreateAuthARecord(
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
