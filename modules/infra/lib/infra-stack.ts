import * as core from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as lam from 'aws-cdk-lib/aws-lambda';
import * as agw from 'aws-cdk-lib/aws-apigateway';

export class InfraStack extends core.Stack {
  constructor(scope: Construct, id: string, props: core.StackProps) {
    super(scope, id, props);
    const repo = ecr.Repository.fromRepositoryName(this, 'conlam-repo', 'conlam');

    const lambda = new lam.DockerImageFunction(this, 'conlam-func', {
      functionName: 'conlam-func',
      code: lam.DockerImageCode.fromEcr(repo, {tag: '0.0.6'}),
      tracing: lam.Tracing.ACTIVE,
      timeout: core.Duration.minutes(1)
    });

    new agw.LambdaRestApi(this, 'conlam-api', {
      handler: lambda,
      restApiName: 'conlam-api'
    });
  }
}
