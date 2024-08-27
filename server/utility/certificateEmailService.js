const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const mailjet = require('node-mailjet');
const { Storage } = require('@google-cloud/storage'); 
const dotenv = require('dotenv');

dotenv.config();

const storage = new Storage({});
const bucketName = 'ts-trainings-certifications';

const mailjetClient = mailjet.apiConnect(
  process.env.MAILJET_API_KEY, 
  process.env.MAILJET_SECRET_KEY
);

const generateCertificate = async (studentName, courseName, details, certificationNumber) => {
  const browser = await puppeteer.launch({
    executablePath: '/app/.apt/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
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

  const publicUrl = `https://storage.googleapis.com/${bucketName}/${filePath}`;
  return publicUrl;
};

async function sendCertificateEmail(to, certificateUrl) { 
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
          Subject: "Your Course Completion Certificate",
          TextPart: `Congratulations on completing your course! You can download your certificate from the following link: ${certificateUrl}`,
          Attachments: [
            {
              "ContentType": "application/pdf",
              "Filename": path.basename(certificateUrl),
              "Base64Content": certificateUrl
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
