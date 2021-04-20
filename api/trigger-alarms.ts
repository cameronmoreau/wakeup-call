import { VercelRequest, VercelResponse } from "@vercel/node";
import { triggerCalls } from "../core/call-manager";

export default async (request: VercelRequest, response: VercelResponse) => {
  const now = new Date();
  await triggerCalls(now.getHours(), now.getMinutes());

  response.status(200).send("ok");
};
