import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { S3ClientConfig } from "@aws-sdk/client-s3";
import { CredentialProvider } from '@aws-sdk/types';
import { isBucketExist } from '../utils/s3/findBucket';
import { assertError } from '@backstage/errors';
import { createBucket } from '../utils/s3/createBucket';


export const createS3Bucket = (options?: {
  credentials?: CredentialProvider;
}) => {
  return createTemplateAction({
    id: 'frwk:aws:s3:create',
    schema: {
      input: {
        required: ['bucketName', 'region'],
        type: 'object',
        properties: {
          bucketName: {
            type: 'string',
            title: "Bucket Name",
            description: "Bucket name to create"
          },
          region: {
            type: 'string',
            title: "Region",
            description: "Region to create bucket in"
          }
        },
      },
      output: {
        type: 'object',
        properties: {
          bucketLocation: {
            type: 'string',
            title: "Bucket Location",
            description: "Bucket location created"
          }
        },
      }
    },

    async handler(ctx) {
      const bucketName = String(ctx.input.bucketName);
      const region = String(ctx.input.region);

      const config: S3ClientConfig = {
        ...(options?.credentials && {
          credentials: await options.credentials(),
        }),
        region: region
      };
      // const client = new S3Client(config);

      try {
        // Verificando se o bucket já existe
        const existBucket = await isBucketExist(config, bucketName);

        if (!existBucket) {
          try {
            // Criando o bucket
            const bucketLocation = await createBucket(config, bucketName, region);
            ctx.output('bucketLocation', bucketLocation);

            ctx.logger.info(`Bucket ${bucketName} created`);

          } catch (error) {
            assertError(`Error creating bucket ${bucketName}`);

            ctx.logger.warn(`Error creating bucket ${bucketName}`);
            return;
          }
        } else {
          assertError(`Bucket ${bucketName} already exists`);

          ctx.logger.warn(`Bucket ${bucketName} already exists`);
          return;
        }
      } catch (error) {
        console.error('error', error);
        assertError(`Error checking if bucket ${bucketName} exists`);

        ctx.logger.warn(`Error checking if bucket ${bucketName} exists`);
        return;
      }

    },
  });
};