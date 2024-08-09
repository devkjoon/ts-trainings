const mailjet = require('node-mailjet');
const dotenv = require('dotenv');

dotenv.config();

const mailjetClient = mailjet.apiConnect(
  process.env.MAILJET_API_KEY, 
  process.env.MAILJET_SECRET_KEY
);
async function sendEmail(to, subject, text) {
  try {
    const request = mailjetClient.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "info@thinksafetyllcs.com",
            Name: "Think Safety"
          },
          To: [
            {
              Email: to,
              Name: "Recipient"
            }
          ],
          Subject: subject,
          TextPart: text,
          ReplyTo: {
            Email: "info@thinksafetyllcs.com",
            Name: "Think Safety"
          }
        }
      ]
    });

    const response = await request;
    console.log('Email sent:', response.body);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = { sendEmail };