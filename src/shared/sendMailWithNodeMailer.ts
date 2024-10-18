import nodemailer from "nodemailer";
import config from "../config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.google_smtp.user,
    pass: config.google_smtp.pass,
  },
});

export type TMailConfig = {
  to: string[];
  subject: string;
  text?: string;
  html?: string;
};

const sendMailWithNodeMailer = async ({
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

export default sendMailWithNodeMailer;
