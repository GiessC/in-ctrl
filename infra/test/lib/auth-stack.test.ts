import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { AuthStack } from '../../src/lib/auth-stack';

// ? TODO: We need to figure out how to test that our logical IDs never change
it('Creates Cognito User Pool', () => {
    // Given
    const app = new App();

    // When
    const stack = new AuthStack(app, 'TestAuthStack');

    // Then
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::Cognito::UserPool', {});
});

it('Creates Cognito User Pool Client', () => {
    // Given
    const app = new App();

    // When
    const stack = new AuthStack(app, 'TestAuthStack');

    // Then
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::Cognito::UserPoolClient', {});
});
