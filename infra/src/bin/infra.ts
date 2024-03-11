#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import 'source-map-support/register';
import DevelopmentStack from '../lib/stacks/env/development/developmentStack';
import LocalStack from '../lib/stacks/env/local/localStack';
import ProductionStack from '../lib/stacks/env/production/productionStack';

const app = new App();
const environment = app.node.tryGetContext('environment');

// Use PascalCase for stack IDs. Let AWS pick names for all resources.
// https://docs.aws.amazon.com/prescriptive-guidance/latest/best-practices-cdk-typescript-iac/best-practices.html
if (!environment || environment === 'development') {
    new DevelopmentStack(app, 'Ctrl-Dev');
} else if (environment === 'production') {
    new ProductionStack(app, 'Ctrl-Prod');
} else {
    console.info(
        `Using local environment. CloudFormation stacks will be created using ID=Ctrl-${environment}`,
    );
    new LocalStack(app, `Ctrl-${environment}`);
}

app.synth();
