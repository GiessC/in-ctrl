import { Duration, RemovalPolicy } from 'aws-cdk-lib';
import {
    Certificate,
    type ICertificate,
} from 'aws-cdk-lib/aws-certificatemanager';
import {
    CloudFrontWebDistribution,
    OriginAccessIdentity,
    PriceClass,
    SSLMethod,
    SecurityPolicyProtocol,
    ViewerCertificate,
    type IDistribution,
} from 'aws-cdk-lib/aws-cloudfront';
import {
    RecordTarget,
    type ARecord,
    type IHostedZone,
} from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { Bucket, BucketAccessControl } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import path from 'path';
import type DefaultModuleProps from '../../common/defaultModuleProps';
import Route53Resource from '../../common/resources/route53';
import { type Settings } from '../../common/settings';

export interface WebModuleProps extends DefaultModuleProps {
    certificateArn: string;
    hostedZone: IHostedZone;
}

export default class WebModule extends Construct {
    private readonly _distribution: IDistribution;
    private readonly _aRecord: ARecord;

    public get distribution(): IDistribution {
        return this._distribution;
    }

    public get aRecord(): ARecord {
        return this._aRecord;
    }

    constructor(
        scope: Construct,
        id: string,
        { settings, certificateArn, hostedZone }: WebModuleProps,
    ) {
        super(scope, id);
        const bucket = this.createWebBucket(
            `${id}-Bucket`,
            settings.RemovalPolicy,
        );
        this.createWebBucketDeployment(`${id}-Deployment`, bucket);
        this._distribution = this.createCloudfrontDistribution(
            id,
            bucket,
            Certificate.fromCertificateArn(this, `${id}-Cert`, certificateArn),
            settings,
        );
        this._aRecord = this.createWebARecord(
            `${id}-ARecord`,
            hostedZone,
            this._distribution,
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
        settings: Settings,
    ): IDistribution {
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
                        },
                    ],
                    connectionAttempts: 3,
                    connectionTimeout: Duration.seconds(10),
                },
            ],
            enabled: true,
            priceClass: PriceClass.PRICE_CLASS_ALL,
            viewerCertificate: ViewerCertificate.fromAcmCertificate(
                certificate,
                {
                    aliases: [settings.DomainSettings.DomainName],
                    sslMethod: SSLMethod.SNI,
                    securityPolicy: SecurityPolicyProtocol.TLS_V1_2_2021,
                },
            ),
        });
    }

    private createWebARecord(
        id: string,
        hostedZone: IHostedZone,
        distribution: IDistribution,
    ): ARecord {
        return Route53Resource.createARecord(this, id, {
            target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
            zone: hostedZone,
        });
    }
}
