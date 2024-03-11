import { type StackProps } from 'aws-cdk-lib';
import { type Settings } from './settings';

export default interface DefaultStackProps extends StackProps {
    readonly settings: Settings;
}
