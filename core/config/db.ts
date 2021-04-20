import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import * as AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY,
});

export const TABLE_NAME = process.env.DYNAMO_DB_TABLE;
export const dbClient = new DynamoDBClient({ region: "us-east-1" });
