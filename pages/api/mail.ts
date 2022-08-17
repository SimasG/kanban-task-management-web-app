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

  const html = `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div class="">
      <div
        id=":1fu"
        class="ii gt"
        jslog="20277; u014N:xr6bB; 4:W251bGwsbnVsbCxbXV0."
      >
        <div id=":1ft" class="a3s aiL">
          <div>
            <div class="adM"></div>
            <table
              cellspacing="0"
              cellpadding="0"
              border="0"
              style="
                color: #172b4d;
                background: #fff;
                padding: 0;
                margin: 0;
                width: 100%;
                font: 15px 'Helvetica Neue', Arial, Helvetica;
              "
            >
              <tbody>
                <tr width="100%">
                  <td
                    valign="top"
                    align="left"
                    style="
                      background: #fff;
                      font: 15px 'Helvetica Neue', Arial, Helvetica;
                    "
                  >
                    <table
                      style="
                        border: none;
                        padding: 0 18px;
                        margin: 50px auto;
                        width: 500px;
                        border-spacing: 0px;
                      "
                    >
                      <tbody>
                        <tr width="100%" height="57">
                          <td
                            valign="top"
                            align="left"
                            style="
                              border-top-left-radius: 4px;
                              border-top-right-radius: 4px;
                              background: #fff;
                              padding: 12px 18px;
                              text-align: center;
                            "
                          >
                            <img
                              height="65"
                              width="162"
                              src="http://cdn.mcauto-images-production.sendgrid.net/dfa34ef985111972/68738f85-ad2d-497b-aa2e-cb51a9ac2458/268x98.png"
                              title="Kanban"
                              style="
                                font-weight: bold;
                                font-size: 18px;
                                color: #0079bf;
                                vertical-align: top;
                              "
                              class="CToWUd"
                              data-bit="iit"
                            />
                          </td>
                        </tr>

                        <tr style="width: 100%">
                          <td
                            valign="top"
                            align="left"
                            style="background: #fff; padding: 18px"
                          >
                            <p
                              style="
                                color: #172b4d;
                                font: 14px/1.25em 'Helvetica Neue', Arial,
                                  Helvetica;
                                font-weight: bold;
                                line-height: 20px;
                                text-align: center;
                                padding-left: 56px;
                                padding-right: 56px;
                              "
                            >
                              Hey there! Simas Gradeckas invited you to join the
                              Test Board board on Trello:
                            </p>

                            <div
                              style="
                                background: #fff;
                                border: solid 1px #c1c7d0;
                                padding-top: 15px;
                                margin-left: 56px;
                                margin-right: 56px;
                                border-radius: 3px;
                              "
                            >
                              <p
                                style="
                                  color: #172b4d;
                                  line-height: 20px;
                                  text-align: center;
                                  margin: 0;
                                  font-style: italic;
                                  padding-left: 24px;
                                  padding-right: 24px;
                                  padding-top: 17px;
                                  padding-bottom: 17px;
                                "
                              >
                                "Join me on Kanban and let's work together on
                                this board!"
                              </p>
                              <a style="text-decoration: none" target="_blank">
                                <div
                                  width="100%"
                                  align="center"
                                  style="
                                    padding-left: 50px;
                                    padding-right: 50px;
                                    padding-bottom: 32px;
                                    padding-top: 40px;
                                  "
                                >
                                  <table
                                    style="
                                      background-color: #645fc6;
                                      border-radius: 3px;
                                      font: 14px/1.25em 'Helvetica Neue', Arial,
                                        Helvetica;
                                      line-height: 12px;
                                      font-weight: bold;
                                      color: #ffffff;
                                      height: 144px;
                                      width: 248px;
                                    "
                                  >
                                    <tbody>
                                      <tr>
                                        <td
                                          style="
                                            padding-left: 8px;
                                            padding-right: 8px;
                                            padding-top: 4px;
                                            padding-bottom: 4px;
                                            line-height: 20px;
                                          "
                                        >
                                          Test Board
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <img
                                            src="https://ci6.googleusercontent.com/proxy/4l7dyhia4qZJ7k6rU8aMbFZ7KPhr7gnP76Lfzeo5CaAHW3Eo7DnP8C470WQr62xGw-toGgLGL5gtO1wfs5JH=s0-d-e1-ft#https://trello.com/images/board_elements.png"
                                            style="
                                              width: 224px;
                                              height: 91px;
                                              border-radius: 1.55px;
                                              padding-left: 8px;
                                              padding-right: 8px;
                                              padding-bottom: 8px;
                                            "
                                            class="CToWUd"
                                            data-bit="iit"
                                          />
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </a>
                            </div>

                            <p
                              style="
                                font: 15px/1.25em 'Helvetica Neue', Arial,
                                  Helvetica;
                                margin-bottom: 0;
                                text-align: center;
                              "
                            >
                              <a
                                href="https://kanban-task-management-web-app-simasg.vercel.app"
                                style="
                                  border-radius: 3px;
                                  background: #645fc6;
                                  color: #fff;
                                  display: block;
                                  font-weight: 600;
                                  font-size: 20px;
                                  line-height: 24px;
                                  margin: 32px auto 24px;
                                  padding: 11px 13px;
                                  text-decoration: none;
                                  width: 152px;
                                "
                                target="_blank"
                              >
                                Go To Board
                              </a>
                            </p>

                            <p
                              style="
                                font: 14px/1.25em 'Helvetica Neue', Arial,
                                  Helvetica;
                                color: #838c91;
                                text-align: center;
                                padding-left: 56px;
                                padding-right: 56px;
                                padding-bottom: 8px;
                              "
                            >
                              In order to get access to the "board name" board,
                              please sign in using the email address that this
                              email has been sent to
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
            <div data-role="module-unsubscribe" class="module" role="module" data-type="unsubscribe" style="color:#444444; font-size:12px; line-height:20px; padding:16px 16px 16px 16px; text-align:Center;" data-muid="4e838cf3-9892-4a6d-94d6-170e474d21e5">
        
            <p style="font-size:12px; line-height:20px;">
            <a class="Unsubscribe--unsubscribeLink" href="{{{unsubscribe}}}" target="_blank" style="font-family:sans-serif;text-decoration:none;">
            Unsubscribe
            </a>
          -
            <a href="{{{unsubscribe_preferences}}}" target="_blank" class="Unsubscribe--unsubscribePreferences" style="font-family:sans-serif;text-decoration:none;">
            Unsubscribe Preferences
            </a>
            </p>
        </div>
  </body>
</html>
`;

  const data = {
    to: `${body.email}`,
    from: "simas@tstudents.io",
    subject: "You've been invited to join a Kanban Board!",
    text: message,
    html: html,
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
