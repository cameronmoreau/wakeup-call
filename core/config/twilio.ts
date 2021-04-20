import { Twilio } from "twilio";

export const PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

export const twilioClient = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
