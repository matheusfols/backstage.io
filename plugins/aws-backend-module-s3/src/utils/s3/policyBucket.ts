import { PutBucketPolicyCommand, PutBucketWebsiteCommand, PutPublicAccessBlockCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";


const putBucketPolicy = async (config: S3ClientConfig, bucketName: string) => {
  const client = new S3Client(config);
  const policy = {
    Version: "2012-10-17",
    Statement: [{
      Sid: "PublicReadGetObject",
      Effect: "Allow",
      Principal: "*",
      Action: ["s3:GetObject"],
      Resource: [`arn:aws:s3:::${bucketName}/*`]
    }]
  };

  const params = {
    Bucket: bucketName,
    Policy: JSON.stringify(policy)
  };

  const command = new PutBucketPolicyCommand(params);

  try {
    await client.send(command);
  } catch (error) {
    throw new Error(`Error putting bucket policy on bucket ${bucketName}`);
  }
}

// Put public access block on bucket
/** 
 * @param {S3ClientConfig} config - Configuration object for the S3 client
 * @param {string} bucketName - The name of the bucket
  * @param {boolean} status - The status of the public access block
  * @returns {Promise<void>}
 */
const putPublicAccessBlock = async (config: S3ClientConfig, bucketName: string, status: boolean = true) => {
  const client = new S3Client(config);
  const input = {
    Bucket: bucketName,
    PublicAccessBlockConfiguration: {
      BlockPublicAcls: status,
      IgnorePublicAcls: status,
      BlockPublicPolicy: status,
      RestrictPublicBuckets: status,
    },
  }
  const command = new PutPublicAccessBlockCommand(input);

  try {
    await client.send(command);
  } catch (error) {
    throw new Error(`Error putting public access block on bucket ${bucketName}`);
  }
}

// Set bucket as a static website
/** 
 * @param {S3ClientConfig} config - Configuration object for the S3 client
 * @param {string} bucketName - The name of the bucket
 * @param {string} indexFile - The index file for the static website
 * @returns {Promise<void>}
 */
const putBucketWebsite = async (config: S3ClientConfig, bucketName: string, indexFile: string = "index.html") => {
  const client = new S3Client(config);
  const input = {
    Bucket: bucketName,
    WebsiteConfiguration: {
      IndexDocument: {
        Suffix: indexFile
      }
    }
  }

  const command = new PutBucketWebsiteCommand(input);

  try {
    await client.send(command);
  } catch (error) {
    throw new Error(`Error set static website bucket ${bucketName}: ${error}`);
  }
}

export { putPublicAccessBlock, putBucketWebsite, putBucketPolicy }