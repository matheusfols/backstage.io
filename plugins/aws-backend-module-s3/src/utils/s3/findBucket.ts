import { S3ClientConfig, S3Client, HeadBucketCommand } from "@aws-sdk/client-s3";

const findBucket = async (config: S3ClientConfig, bucketName: string): Promise<any> => {
  try {
    const client = new S3Client(config);
    const input = {
      Bucket: bucketName
    };
    const command = new HeadBucketCommand(input);
    const response = await client.send(command);

    return response;
  } catch (error) {
    throw new Error(`Error finding bucket ${bucketName}: ${error}`);
  }
}

const isBucketExist = async (config: S3ClientConfig, bucketName: string): Promise<boolean> => {
  try {
    const response = await findBucket(config, bucketName);
    const { $metadata } = response;
    if ($metadata?.httpStatusCode === 404) {
      return false;
    }
    return !!response;
  } catch (error) {
    return false;
  }
}

export { findBucket, isBucketExist }