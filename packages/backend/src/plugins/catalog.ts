import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-catalog-backend-module-scaffolder-entity-model';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { GithubEntityProvider } from '@backstage/plugin-catalog-backend-module-github';
// import { AwsS3EntityProvider } from '@backstage/plugin-catalog-backend-module-aws';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  builder.addEntityProvider(
    GithubEntityProvider.fromConfig(env.config, {
      logger: env.logger,
      scheduler: env.scheduler,
    }),
    // GithubOrgEntityProvider.fromConfig(env.config, {
    //   id: process.env.NODE_ENV || 'production',
    //   orgUrl: `https://github.com/${process.env.GITHUB_ORG}`,
    //   logger: env.logger,
    //   schedule: env.scheduler.createScheduledTaskRunner({
    //     frequency: { minutes: 60 },
    //     timeout: { minutes: 15 },
    //   }),
    // }),
    // AwsS3EntityProvider.fromConfig(env.config, {
    //   logger: env.logger,
    //   scheduler: env.scheduler,
    // }),
  );
  builder.addProcessor(new ScaffolderEntitiesProcessor());
  const { processingEngine, router } = await builder.build();
  await processingEngine.start();
  return router;
}
