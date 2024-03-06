import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { InfraStack } from '../lib/infra-stack';

it('S3 Bucket Created', () => {
    // Given
    const app = new App();

    // When
    const stack = new InfraStack(app, 'TestInfraStack');

    // Then
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::S3::Bucket', {
        BucketName: 'testinfrastack-samplebucket',
    });
});
