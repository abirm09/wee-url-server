import nodemailer from "nodemailer";
import { env } from "../config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.google_smtp.user,
    pass: env.google_smtp.pass,
  },
});

export type TMailConfig = {
  to: string[];
  subject: string;
  text?: string;
  html?: string;
};

export const sendMailWithNodeMailer = async ({
  to,
  subject,
  text,
  html,
}: TMailConfig) => {
  const res = await transporter.sendMail({
    from: `WeeURL no-replay@mail.weeurl.abirmahmud.top`,
    to: to.join(","),
    subject,
    text,
    html,
  });
  return res;
};
