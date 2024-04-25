import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { S3ClientConfig } from "@aws-sdk/client-s3";
import { CredentialProvider } from '@aws-sdk/types';
import { isBucketExist } from '../utils/s3/findBucket';
import { assertError } from '@backstage/errors';
import { createBucket } from '../utils/s3/createBucket';
import { putBucketPolicy, putBucketWebsite, putPublicAccessBlock } from '../utils/s3/policyBucket';


export const staticWebsiteS3Bucket = (options?: {
  credentials?: CredentialProvider;
}) => {
  return createTemplateAction({
    id: 'frwk:aws:s3:websitestatic:create',
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
          },
          isStaticWebsite: {
            type: 'boolean',
            title: "Is Static Website",
            description: "Enable static website hosting",
            default: true
          },
          indexFile: {
            type: 'string',
            title: "Index File Name",
            description: "Index File Name for Enable static website hosting",
            default: 'index.html'
          },
        },
      },
      output: {
        type: 'object',
        properties: {
          bucketLocation: {
            type: 'string',
            title: "Bucket Location",
            description: "Bucket location created"
          },
          bucketLocationWebsite: {
            type: 'string',
            title: "Bucket Location Website",
            description: "Bucket location website created"
          }
        },
      }
    },

    async handler(ctx) {
      const bucketName = String(ctx.input.bucketName);
      const region = String(ctx.input.region);
      const isStaticWebsite = Boolean(ctx.input.isStaticWebsite);
      const indexFile = String(ctx.input.indexFile);

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

            // Verificando se é um website estático
            if (isStaticWebsite) {
              try {
                // Removendo bloqueio de acesso público
                await putPublicAccessBlock(config, bucketName, false);
                ctx.logger.info(`Public access block put on bucket ${bucketName}`);

                try {
                  // Configurando o bucket para ser um website
                  await putBucketWebsite(config, bucketName, indexFile);
                  ctx.logger.info(`Website hosting enabled: ${bucketName}`);

                  try {
                    await putBucketPolicy(config, bucketName);
                    ctx.logger.info(`Bucket policy updated: ${bucketName}`);

                    const bucketLocationWebsite = `http://${bucketName}.s3-website.${region}.amazonaws.com`;
                    ctx.output('bucketLocationWebsite', bucketLocationWebsite);

                  } catch (error) {
                    assertError(`Error putting bucket policy on bucket ${bucketName}`);

                    ctx.logger.warn(`Error putting bucket policy on bucket ${bucketName}`);
                    return;
                  }

                } catch (error) {
                  assertError(`Error set static website bucket ${bucketName}`);

                  ctx.logger.warn(`Error set static website bucket ${bucketName}`);
                  return;
                }
              } catch (error) {
                assertError(`Error putting public access block on bucket ${bucketName}`);

                ctx.logger.warn(`Error putting public access block on bucket ${bucketName}`);
                return;
              }
            }



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