import { faker } from '@faker-js/faker';
import { RemovalPolicy } from 'aws-cdk-lib';
import { Settings } from '../../src/lib/common/settings';

const createRandomSettings = (removalPolicy?: RemovalPolicy): Settings => ({
    AwsSettings: {
        Profile: faker.string.alphanumeric({
            length: {
                min: 8,
                max: 12,
            },
        }),
        Region: faker.string.alpha(),
    },
    DomainSettings: {
        CertificateArn: faker.string.alphanumeric(),
        HostedZoneId: faker.string.alphanumeric(),
    },
    RemovalPolicy: removalPolicy ?? faker.helpers.enumValue(RemovalPolicy),
});

export default createRandomSettings;
