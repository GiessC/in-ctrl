#!/usr/bin/env node
import { App, Environment } from 'aws-cdk-lib';
import 'source-map-support/register';
import type Settings from '../lib/config/settings';
import CoreStack from '../lib/stacks/coreStack';
import { loadSettings } from './startup/extensions';

const app = new App();
const settings: Settings = loadSettings(app);
const env: Environment = {
    account: process.env.AWS_ACCOUNT,
    region: process.env.AWS_REGION,
};

// Prefix all Stack IDs with Ctrl. Use PascalCase for stack IDs. Let AWS pick names for all resources.
// https://docs.aws.amazon.com/prescriptive-guidance/latest/best-practices-cdk-typescript-iac/best-practices.html

new CoreStack(app, `CtrlCore`, { env, settings });

app.synth();
