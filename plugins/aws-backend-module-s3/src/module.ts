import { coreServices, createBackendModule } from '@backstage/backend-plugin-api';

export const awsModuleS3 = createBackendModule({
  pluginId: 'aws',
  moduleId: 's3',
  register(reg) {
    reg.registerInit({
      deps: { logger: coreServices.logger },
      async init({ logger }) {
        logger.info('Hello World!')
      },
    });
  },
});
