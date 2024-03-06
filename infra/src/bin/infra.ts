#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import 'source-map-support/register';
import { AuthStack } from '../lib/auth-stack';

const app = new App();
new AuthStack(app, 'InfraStack');
app.synth();
