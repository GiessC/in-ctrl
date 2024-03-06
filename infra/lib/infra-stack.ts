import { RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib';
import { Bucket, HttpMethods } from 'aws-cdk-lib/aws-s3';
import { type Construct } from 'constructs';

export class InfraStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        this.CreateSampleS3Bucket(this, id);
    }

    private CreateSampleS3Bucket(scope: Construct, id: string) {
        new Bucket(scope, `${id}-SampleBucket`, {
            bucketName: `${id}-SampleBucket`.toLowerCase(),
            cors: [
                {
                    allowedMethods: [
                        HttpMethods.GET,
                        HttpMethods.PUT,
                        HttpMethods.POST,
                        HttpMethods.DELETE,
                        HttpMethods.HEAD,
                    ],
                    allowedOrigins: ['*'],
                    allowedHeaders: ['*'],
                    id: `${id}-SampleBucket-Cors`,
                },
            ],
            autoDeleteObjects: true,
            removalPolicy: RemovalPolicy.DESTROY,
        });
    }
}
