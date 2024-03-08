import { ARecord, type ARecordProps } from 'aws-cdk-lib/aws-route53';
import { type Construct } from 'constructs';

export default class Route53Resource {
    public static createARecord(
        scope: Construct,
        id: string,
        props: ARecordProps,
    ): ARecord {
        return new ARecord(scope, id, {
            region: 'us-east-1',
            deleteExisting: true,
            ...props,
        });
    }
}
