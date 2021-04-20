import { VercelRequest, VercelResponse } from "@vercel/node";
import { listAlarms } from "../core/call-manager";

export default async (request: VercelRequest, response: VercelResponse) => {
  const query = (request.query as unknown) as { phone: string };
  const alarms = await listAlarms(query.phone);

  response.status(201).send({ alarms });
};
