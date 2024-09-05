const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const mailjet = require('node-mailjet');
const { Storage } = require('@google-cloud/storage');
const dotenv = require('dotenv');

dotenv.config();

const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
});
const bucketName = 'ts-trainings-certifications';

const mailjetClient = mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY
);

const generateCertificate = async (studentName, courseName, details, certificationNumber) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', `--window-size=1280x1024`],
  });

  const page = await browser.newPage();

  const templatePath = path.join(__dirname, '../assets/certificate-template.html');
  let content = fs.readFileSync(templatePath, 'utf8');

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  content = content
    .replace('{{studentName}}', studentName)
    .replace('{{courseName}}', courseName)
    .replace('{{certificationNumber}}', certificationNumber)
    .replace('{{completionDate}}', new Date().toLocaleDateString('en-US', options))
    .replace('{{primaryDetail}}', details.primary)
    .replace('{{secondaryDetail}}', details.secondary);

  await page.setContent(content);

  const pdfBuffer = await page.pdf({
    format: 'letter',
    landscape: true,
    printBackground: true,
  });

  await browser.close();

  const sanitizedStudentName = studentName.replace(/[^a-zA-Z0-9-_ ]/g, '').replace(/ /g, '-');
  const sanitizedCourseName = courseName.replace(/[^a-zA-Z0-9-_ ]/g, '').replace(/ /g, '-');

  const filePath = `${sanitizedCourseName}/${sanitizedStudentName}.pdf`;

  const file = storage.bucket(bucketName).file(filePath);
  await file.save(pdfBuffer, {
    metadata: {
      contentType: 'application/pdf',
    },
  });

  return filePath;
};

async function sendCertificateEmail(to, filePath, student, course) {
  try {
    const [fileContent] = await storage.bucket(bucketName).file(filePath).download();
    const Base64Content = fileContent.toString('base64');

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
          Subject: 'Course Certificate',
          HTMLPart: `
            <div style="font-family: Arial, sans-serif; color: #333;">
              <h2 style="color: #17a2b8;">
                Congratulations <span style="color: #ffc107;">${student.firstname}!</span>
              </h2>
              <p style="font-size: 16px;">
                You have completed the ${course.title} online training course.
                <br><br>
                Your commitment to improving your skills is truly commendable.
                <br>
                As a token of your achievement, we have attached your certificate to this email.
                <br><br>
                We encourage you to continue your learning journey.
                <br>
                Check out our other courses on our platform to further enhance your expertise.
                <br><br>
                Regards,
                <br><br>
                <table role="presentation" style="width: 100%; border-spacing: 0;">
                  <tr>
                    <td style="width: 75px;">
                      <img src="https://github.com/devkjoon/ts-trainings/blob/main/server/assets/think-safety-logo.png?raw=true" 
                          alt="Company Logo"
                          width="75" 
                          height="75" 
                          style="width: 75px; height: 75px; max-width: 75px; display: block;" />
                    </td>
                    <td style="vertical-align: bottom; padding: 0 0 15px 10px;">
                      <strong style="font-size: 13px;">Think Safety LLCS<br>
                          +1 (571) 351-9191
                      </strong>
                    </td>
                  </tr>
                </table>
              </p>
              <hr style="border-top: 1px solid #eee;">
              <footer>
                <p style="font-size: 11px; color: #888;">
                  This email was sent to you by Think Safety LLC. If you have any questions or need further assistance, please don't hesitate to contact us at 
                  <a href="mailto:info@thinksafetyllcs.com" 
                    style="color: #17a2b8; text-decoration: none; font-style: italic;">
                    info@thinksafetyllcs.com
                  </a>.
                </p>
              </footer>
            </div>
          `,
          Attachments: [
            {
              ContentType: 'application/pdf',
              Filename: path.basename(filePath),
              Base64Content: Base64Content,
            },
          ],
          ReplyTo: {
            Email: 'info@thinksafetyllcs.com',
            Name: 'Think Safety',
          },
        },
      ],
    });

    const response = await request;
    console.log('Certificate email sent');
  } catch (error) {
    console.error('Error sending certificate email:', error);
  }
}

async function resendCertificateEmail(to, filePath, student, course) {
  try {
    // Retrieve the file from Google Cloud Storage
    const [fileContent] = await storage.bucket(bucketName).file(filePath).download();
    const Base64Content = fileContent.toString('base64');

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
              Name: `${student.firstname} ${student.lastname}`,
            },
          ],
          Subject: `Your Certificate for ${course.title}`,
          HTMLPart: `
            <div style="font-family: Arial, sans-serif; color: #333;">
              <h2 style="color: #17a2b8;">
                Hello <span style="color: #ffc107;">${student.firstname}!</span>
              </h2>
              <p style="font-size: 16px;">
                As requested, we are resending you your certificate for completing the ${course.title} online training course.
                <br><br>
                Your certificate is attached to this email.
                <br><br>
                Regards,
                <br><br>
                <table role="presentation" style="width: 100%; border-spacing: 0;">
                  <tr>
                    <td style="width: 75px;">
                      <img src="https://github.com/devkjoon/ts-trainings/blob/main/server/assets/think-safety-logo.png?raw=true" 
                          alt="Company Logo"
                          width="75" 
                          height="75" 
                          style="width: 75px; height: 75px; max-width: 75px; display: block;" />
                    </td>
                    <td style="vertical-align: bottom; padding: 0 0 15px 10px;">
                      <strong style="font-size: 13px;">Think Safety LLCS<br>
                          +1 (571) 351-9191
                      </strong>
                    </td>
                  </tr>
                </table>
              </p>
              <hr style="border-top: 1px solid #eee;">
              <footer>
                <p style="font-size: 11px; color: #888;">
                  This email was sent to you by Think Safety LLC. If you have any questions or need further assistance, please don't hesitate to contact us at 
                  <a href="mailto:info@thinksafetyllcs.com" 
                    style="color: #17a2b8; text-decoration: none; font-style: italic;">
                    info@thinksafetyllcs.com
                  </a>.
                </p>
              </footer>
            </div>
          `,
          Attachments: [
            {
              ContentType: 'application/pdf',
              Filename: path.basename(filePath),
              Base64Content: Base64Content,
            },
          ],
          ReplyTo: {
            Email: 'info@thinksafetyllcs.com',
            Name: 'Think Safety',
          },
        },
      ],
    });

    const response = await request;
    console.log('Certificate email resent');
    return true;
  } catch (error) {
    console.error('Error resending certificate email:', error);
    throw error;
  }
}

module.exports = { generateCertificate, sendCertificateEmail, resendCertificateEmail };
