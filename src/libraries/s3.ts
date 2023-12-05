import { S3Client } from "@aws-sdk/client-s3";
import { awsConfig } from "../configs/aws";

export let s3: S3Client;

export const s3Library = (): void => {
  s3 ??= new S3Client(awsConfig);
};
