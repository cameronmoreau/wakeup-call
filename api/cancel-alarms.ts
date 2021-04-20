import { VercelRequest, VercelResponse } from "@vercel/node";
import { cancelAlarms } from "../core/call-manager";

export default async (request: VercelRequest, response: VercelResponse) => {
  const query = (request.query as unknown) as { phone: string };
  await cancelAlarms(query.phone);

  response.status(201).send("ok");
};
