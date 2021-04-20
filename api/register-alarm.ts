import { VercelRequest, VercelResponse } from "@vercel/node";
import { createAlarm, ICreateWakeupCallOptions } from "../core/call-manager";

export default async (request: VercelRequest, response: VercelResponse) => {
  await createAlarm((request.query as unknown) as ICreateWakeupCallOptions);
  response.status(201).send("ok");
};
