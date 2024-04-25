import { CatalogClient } from '@backstage/catalog-client';
import { createBuiltinActions, createRouter } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';
import { createAwsS3CpAction, createEcrAction, createAwsSecretsManagerCreateAction } from '@roadiehq/scaffolder-backend-module-aws';
import { ScmIntegrations } from '@backstage/integration';
import { fromIni } from "@aws-sdk/credential-providers";
import { createS3Bucket } from '@internal/backstage-plugin-aws-backend-module-s3';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {

  const integrations = ScmIntegrations.fromConfig(env.config);
  const catalogClient = new CatalogClient({
    discoveryApi: env.discovery,
  });


  const actions = [
    createAwsS3CpAction({ credentials: fromIni({ profile: "dev" }) }),
    createEcrAction(),
    createAwsSecretsManagerCreateAction(),
    ...createBuiltinActions({
      reader: env.reader,
      catalogClient,
      config: env.config,
      integrations: integrations as any
    }),
    createS3Bucket()
  ];

  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    reader: env.reader,
    catalogClient,
    identity: env.identity,
    permissions: env.permissions,
    actions
  });
}
