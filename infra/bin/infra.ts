#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import 'source-map-support/register';
import { InfraStack } from '../lib/infra-stack';

const app = new App();
new InfraStack(app, 'InfraStack');
