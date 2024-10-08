const mailjet = require('node-mailjet');
const dotenv = require('dotenv');

dotenv.config();

const mailjetClient = mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY
);

async function sendEmail(to, subject, content) {
  try {
    const request = mailjetClient.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'info@thinksafetyllcs.com',
            Name: 'Think Safety',
          },
          To: [
            {
              Email: to,
              Name: 'Recipient',
            },
          ],
          Subject: subject,
          HTMLPart: `
            <div style="font-family: Arial, sans-serif; color: #333; font-size: 14px; line-height: 1.6;">
              <div style="font-size: 14px;">
                ${content}
              </div>
              <br>
              <p style="margin-bottom: 5px;">Regards,</p>
              <table role="presentation" style="width: 100%; border-spacing: 0;">
                <tr>
                  <td style="padding-bottom: 5px;">
                    <strong style="font-size: 12px;">Think Safety LLCS<br>
                      +1 (571) 351-9191
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td>
                    <img src="https://github.com/devkjoon/ts-trainings/blob/main/server/assets/think-safety-logo.png?raw=true" 
                        alt="Company Logo"
                        width="75" 
                        height="75" 
                        style="width: 75px; height: 75px; max-width: 75px; display: block;" />
                  </td>
                </tr>
              </table>
              <hr style="border-top: 1px solid #eee;">
              <footer>
                <p style="font-size: 10px; color: #888;">
                  This email was sent to you by Think Safety LLC. If you have any questions or need further assistance, please don't hesitate to contact us at 
                  <a href="mailto:info@thinksafetyllcs.com" 
                    style="color: #17a2b8; text-decoration: none; font-style: italic;">
                    info@thinksafetyllcs.com
                  </a>.
                </p>
              </footer>
            </div>
          `,
          ReplyTo: {
            Email: 'info@thinksafetyllcs.com',
            Name: 'Think Safety',
          },
        },
      ],
    });

    const response = await request;
    console.log('Email sent:', response.body);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = { sendEmail };
