import { CreateBucketCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";

const createBucket = async (config: S3ClientConfig, bucketName: string, region: string) => {
  try {
    const client = new S3Client(config);
    const command = new CreateBucketCommand({
      Bucket: bucketName,
    });

    const { Location } = await client.send(command);
    return Location;
  } catch (error) {
    throw new Error(`Error creating bucket ${bucketName}: ${error}`);
  }
}

export { createBucket };