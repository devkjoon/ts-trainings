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
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  
  const templatePath = path.join(__dirname, '../assets/certificate-template.html');
  let content = fs.readFileSync(templatePath, 'utf8');

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  content = content.replace('{{studentName}}', studentName)
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
          Subject: "Course Completion Certificate",
          HTMLPart: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #17a2b8;">Congratulations ${student.firstname}!</h2>
          <p>You have completed the ${course.title} online training course.</p>
          <p>Please find your certificate attached to this email.</p>
          <br>
          <p>Kind regards,</p>
          <table role="presentation" style="margin: 0 auto;">
            <tr>
              <td style="padding-right: 8px;">
                <img src="https://github.com/devkjoon/ts-trainings/blob/main/server/assets/think-safety-logo.png?raw=true" alt="Company Logo"
                    width="75" height="75" style="width: 75px; height: 75px; max-width: 75px; display: block;" />
              </td>
              <td style="vertical-align: middle;">
                <p style="margin: 0; font-weight: bold;">Think Safety LLCS</p>
              </td>
            </tr>
          </table>
          <hr style="border-top: 1px solid #eee;">
          <footer style="font-size: 6px; color: #888;">
            <p>This email was sent to you by Think Safety LLC. If you have any questions, please contact us at <a href="mailto:info@thinksafetyllcs.com" style="color: #007bff; text-underline: none;">info@thinksafetyllcs.com</a>.</p>
          </footer>
        </div>  
`,
          Attachments: [
            {
              "ContentType": "application/pdf",
              "Filename": path.basename(filePath),
              "Base64Content": Base64Content
            }
          ],
          ReplyTo: {
            Email: "info@thinksafetyllcs.com",
            Name: "Think Safety"
          }
        }
      ]
    });

    const response = await request;
    console.log('Certificate email sent');
  } catch (error) {
    console.error('Error sending certificate email:', error);
  }
}


module.exports = { generateCertificate, sendCertificateEmail };
