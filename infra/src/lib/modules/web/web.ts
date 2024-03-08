import { Duration, RemovalPolicy } from 'aws-cdk-lib';
import {
    Certificate,
    type ICertificate,
} from 'aws-cdk-lib/aws-certificatemanager';
import {
    CloudFrontAllowedCachedMethods,
    CloudFrontAllowedMethods,
    CloudFrontWebDistribution,
    IDistribution,
    OriginAccessIdentity,
    PriceClass,
    ViewerCertificate,
} from 'aws-cdk-lib/aws-cloudfront';
import { Bucket, BucketAccessControl } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import path from 'path';
import type DefaultModuleProps from '../../common/defaultModuleProps';
import { type Settings } from '../../common/settings';

export interface WebModuleProps extends DefaultModuleProps {
    certificateArn: string;
}

export default class WebModule extends Construct {
    private readonly _distribution: IDistribution;

    public get distribution(): IDistribution {
        return this._distribution;
    }

    constructor(
        scope: Construct,
        id: string,
        { settings, certificateArn }: WebModuleProps,
    ) {
        super(scope, id);
        this.createTemporaryWebApp(id, certificateArn, settings);
    }

    private createTemporaryWebApp(
        id: string,
        certificateArn: string,
        settings: Settings,
    ) {
        const bucket = this.createWebBucket(
            `${id}-Bucket`,
            settings.RemovalPolicy,
        );
        this.createWebBucketDeployment(`${id}-Deployment`, bucket);
        this.createCloudfrontDistribution(
            id,
            bucket,
            Certificate.fromCertificateArn(this, `${id}-Cert`, certificateArn),
        );
    }

    private createWebBucket(
        id: string,
        removalPolicy: RemovalPolicy = RemovalPolicy.DESTROY,
    ): Bucket {
        return new Bucket(this, id, {
            accessControl: BucketAccessControl.PRIVATE,
            autoDeleteObjects: removalPolicy === RemovalPolicy.DESTROY,
            removalPolicy,
        });
    }

    private createWebBucketDeployment(
        id: string,
        destinationBucket: Bucket,
    ): BucketDeployment {
        return new BucketDeployment(this, id, {
            destinationBucket,
            sources: [Source.asset(path.join(__dirname, 'asset-input.zip'))],
        });
    }

    private createCloudfrontDistribution(
        id: string,
        s3Bucket: Bucket,
        certificate: ICertificate,
    ) {
        const originAccessIdentity = new OriginAccessIdentity(
            this,
            `${id}-OAI`,
        );
        s3Bucket.grantRead(originAccessIdentity);
        return new CloudFrontWebDistribution(this, id, {
            defaultRootObject: 'index.html',
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: s3Bucket,
                        originAccessIdentity,
                    },
                    behaviors: [
                        {
                            isDefaultBehavior: true,
                            allowedMethods:
                                CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
                            cachedMethods:
                                CloudFrontAllowedCachedMethods.GET_HEAD_OPTIONS,
                        },
                    ],
                    connectionAttempts: 3,
                    connectionTimeout: Duration.seconds(10),
                },
            ],
            enabled: true,
            priceClass: PriceClass.PRICE_CLASS_100,
            viewerCertificate:
                ViewerCertificate.fromAcmCertificate(certificate),
        });
    }
}
