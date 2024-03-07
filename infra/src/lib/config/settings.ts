import { type RemovalPolicy } from 'aws-cdk-lib';

export const requiredKeys = ['CERTIFICATE_ARN', 'HOSTED_ZONE_ID'];

export default interface Settings extends Record<string, unknown> {
    readonly REMOVAL_POLICY?: RemovalPolicy;
    readonly CERTIFICATE_ARN: string;
    readonly HOSTED_ZONE_ID: string;
    readonly AWS_ACCOUNT?: string;
    readonly AWS_REGION?: string;
}
