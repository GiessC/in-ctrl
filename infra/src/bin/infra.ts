#!/usr/bin/env node
import { App, Environment } from 'aws-cdk-lib';
import 'source-map-support/register';
import DevelopmentStack from '../lib/stacks/env/development/developmentStack';
import LocalStack from '../lib/stacks/env/local/localStack';
import ProductionStack from '../lib/stacks/env/production/productionStack';

const app = new App();
const env: Environment = {
    account: process.env.AWS_ACCOUNT,
    region: process.env.AWS_REGION,
};
console.info(`Using AWS environment: ${env.account} ${env.region}`);
const environment = app.node.tryGetContext('environment');

// Use PascalCase for stack IDs. Let AWS pick names for all resources.
// https://docs.aws.amazon.com/prescriptive-guidance/latest/best-practices-cdk-typescript-iac/best-practices.html
if (!environment || environment === 'development') {
    new DevelopmentStack(app, 'Ctrl-Dev', { env });
} else if (environment === 'production') {
    new ProductionStack(app, 'Ctrl-Prod', { env });
} else {
    console.info(
        `Using local environment. CloudFormation stacks will be created using ID=Ctrl-${environment}`,
    );
    new LocalStack(app, `Ctrl-${environment}`, { env });
}

app.synth();
