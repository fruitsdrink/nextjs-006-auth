import Handlebars from "handlebars";
import nodemailer from "nodemailer";
import { activationTemplate } from "./emailtemplates/activation";
import { resetPasswordTemplate } from "./emailtemplates/resetPass";
export async function sendMail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const { SMTP_EMAIL, SMTP_GMAIL_PASS, SMTP_USER, SMTP_PASS } = process.env;

  // const transport = nodemailer.createTransport({
  //   service: "gmail",
  //   auth: {
  //     user: SMTP_EMAIL,
  //     pass: SMTP_GMAIL_PASS,
  //   },
  // });

  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  try {
    const testResult = await transport.verify();
    console.log({ testResult });
    try {
      const sendEmailResult = await transport.sendMail({
        from: SMTP_EMAIL,
        to,
        subject,
        html: body,
        // text: body,
      });
      console.log({ sendEmailResult });

      return sendEmailResult;
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
}

export function compileActivationTemplate(name: string, url: string) {
  const template = Handlebars.compile(activationTemplate);

  const htmlBody = template({ name, url });
  return htmlBody;
}

export function compileResetPasswordTemplate(name: string, url: string) {
  const template = Handlebars.compile(resetPasswordTemplate);

  const htmlBody = template({ name, url });
  return htmlBody;
}
