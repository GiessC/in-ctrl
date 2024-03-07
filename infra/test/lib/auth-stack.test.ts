import { App, CfnElement } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { AuthStack } from '../../src/lib/auth-stack';

it('Did not change logical IDs', () => {
    // ! This test should probably never change.
    // Given
    const app = new App();

    // When
    const stack = new AuthStack(app, 'TestAuthStack');

    // Then
    expect(
        stack.getLogicalId(stack.userPool.node.defaultChild as CfnElement),
    ).toBe('TestAuthStackInControlUsers7D7F009B');
    expect(
        stack.getLogicalId(stack.client.node.defaultChild as CfnElement),
    ).toBe('TestAuthStackInControlUsersClient69E40382');
});

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
