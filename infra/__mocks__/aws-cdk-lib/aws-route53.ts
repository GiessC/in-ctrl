import {
    HostedZone,
    type HostedZoneProviderProps,
} from 'aws-cdk-lib/aws-route53';
import { type Construct } from 'constructs';

jest.spyOn(HostedZone, 'fromLookup').mockImplementation(
    (scope: Construct, id: string, props: HostedZoneProviderProps) =>
        new HostedZone(scope, id, {
            ...props,
            zoneName: 'example.com',
        }),
);
