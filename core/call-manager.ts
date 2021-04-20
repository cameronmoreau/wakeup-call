import {
  BatchWriteItemCommand,
  PutItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { v4 as uuid } from "uuid";

import { dbClient, TABLE_NAME } from "./config/db";
import { PHONE_NUMBER, twilioClient } from "./config/twilio";

export interface ICreateWakeupCallOptions {
  phone: string;
  hour: string;
  minute: string;
}

export async function createAlarm(opts: ICreateWakeupCallOptions) {
  console.log(`Creating alarm for ${opts.phone}`);

  await dbClient.send(
    new PutItemCommand({
      Item: {
        ID: {
          S: uuid(),
        },
        Phone: {
          S: opts.phone,
        },
        Hours: {
          N: opts.hour,
        },
        Minutes: {
          N: opts.minute,
        },
        CallStatus: {
          S: "created",
        },
      },
      TableName: TABLE_NAME,
    })
  );
}

export async function listAlarms(phone: string) {
  const res = await fetchAlarms(phone);
  return res.Items?.map((i) => ({
    phone: i.Phone.S,
    hour: i.Hours.N,
    minute: i.Minutes.N,
    status: i.CallStatus.S,
  }));
}

export async function cancelAlarms(phone: string) {
  console.log(`Canceling alarms for ${phone}`);

  const res = await fetchAlarms(phone);
  await deleteAlarms(res.Items?.map((i) => i.ID.S));
}

export async function triggerCalls(hour: number, minute: number) {
  console.log(`Triggering calls ${hour}h ${minute}m`);

  const res = await dbClient.send(
    new ScanCommand({
      TableName: TABLE_NAME,
      ExpressionAttributeValues: {
        ":s": {
          S: "created",
        },
        ":h": {
          N: hour.toString(),
        },
        ":m": {
          N: minute.toString(),
        },
      },
      FilterExpression: "CallStatus = :s and Hours = :h and Minutes = :m",
    })
  );

  const ids: string[] = [];

  await Promise.all(
    res.Items?.map(async (i) => {
      try {
        await twilioClient.calls.create({
          url: "http://demo.twilio.com/docs/voice.xml",
          to: i.Phone?.S,
          from: PHONE_NUMBER,
        });
        ids.push(i.ID.S);
      } catch (e) {
        console.error(`Issuing calling ${i.Phone.S}`, e);
      }
    })
  );

  await deleteAlarms(ids);
  console.log(`${ids.length} calls completed`);
}

async function fetchAlarms(phone: string) {
  return await dbClient.send(
    new ScanCommand({
      TableName: TABLE_NAME,
      ExpressionAttributeValues: {
        ":p": {
          S: phone,
        },
      },
      FilterExpression: "Phone = :p",
    })
  );
}

async function deleteAlarms(ids: string[]) {
  if (ids.length <= 0) {
    return;
  }

  await dbClient.send(
    new BatchWriteItemCommand({
      RequestItems: {
        [TABLE_NAME]: ids.map((id) => ({
          DeleteRequest: {
            Key: {
              ID: {
                S: id,
              },
            },
          },
        })),
      },
    })
  );
}
