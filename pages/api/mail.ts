// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import "dotenv/config";

const mail = require("@sendgrid/mail");

mail.setApiKey(process.env.SENDGRID_API_KEY);

type Data = {
  status: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const body = JSON.parse(req.body);

  const message = `Message: zdare. Recipient email: ${body.email}`;

  const data = {
    to: `${body.email}`,
    from: "simas@tstudents.io",
    subject: "Testing SendGrid Baby!",
    text: message,
    html: `<strong>${message}</strong>`,
  };

  (async () => {
    try {
      await mail.send(data);
    } catch (error: any) {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
    // "()" at the end immediatelly calls the nameless async callback func.
  })();
  res.status(200).json({ status: "Ok" });
}
