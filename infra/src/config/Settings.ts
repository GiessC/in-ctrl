import { RemovalPolicy } from 'aws-cdk-lib';

export default interface Settings {
    readonly removalPolicy: RemovalPolicy;
}
