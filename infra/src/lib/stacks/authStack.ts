import { Stack } from 'aws-cdk-lib';
import type { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import type { IHostedZone } from 'aws-cdk-lib/aws-route53';
import type { Construct } from 'constructs';
import type DefaultStackProps from '../common/defaultStackProps';
import type { Settings } from '../common/settings';
import { AuthModule } from '../modules/auth/auth';

export interface AuthStackProps extends DefaultStackProps {
    certificate: ICertificate;
    hostedZone: IHostedZone;
}

export default class AuthStack extends Stack {
    // TODO: I think this can be merged back into core stack, with the correct dependencies
    constructor(
        scope: Construct,
        id: string,
        { certificate, hostedZone, settings, ...props }: AuthStackProps,
    ) {
        super(scope, id, props);
        this.addAuthModule(id, certificate, hostedZone, settings);
    }

    private addAuthModule(
        id: string,
        certificate: ICertificate,
        hostedZone: IHostedZone,
        settings: Settings,
    ): AuthModule {
        return new AuthModule(this, `${id}-Auth`, {
            certificate,
            hostedZone,
            settings,
        });
    }
}
