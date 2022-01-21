import formData from "form-data";
import Mailgun from "mailgun.js";

if (typeof process.env.MAILGUN_KEY !== "string") {
  throw new Error("Missing env var `MAILGUN_KEY`");
}

const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_KEY,
});

type Message = {
  from: string;
  to: string;
  subject: string;
  html: string;
};
export function sendEmail(message: Message) {
  if (typeof process.env.MAILGUN_DOMAIN !== "string") {
    throw new Error("Missing env var `MAILGUN_DOMAIN`");
  }
  return client.messages.create(process.env.MAILGUN_DOMAIN, message);
}
