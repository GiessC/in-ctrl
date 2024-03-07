import { faker } from '@faker-js/faker';
import { RemovalPolicy } from 'aws-cdk-lib';
import type Settings from '../../src/lib/config/settings';

const createRandomSettings = (): Settings => {
    return {
        AWS_ACCOUNT: faker.string.alphanumeric({
            length: {
                min: 8,
                max: 12,
            },
        }),
        AWS_REGION: faker.string.alpha(),
        CERTIFICATE_ARN: faker.string.alphanumeric(),
        HOSTED_ZONE_ID: faker.string.alphanumeric(),
        REMOVAL_POLICY: faker.helpers.enumValue(RemovalPolicy),
    };
};

export default createRandomSettings;
