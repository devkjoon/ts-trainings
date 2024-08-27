const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const mailjet = require('node-mailjet')
const dotenv = require('dotenv');

dotenv.config();

const generateCertificate = async (studentName, courseName, details, certificationNumber) => {
  const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
  });

    const page = await browser.newPage();
    
    const templatePath = path.join(__dirname, '../certificate/templates/certificate-template.html');
    let content = fs.readFileSync(templatePath, 'utf8');

    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'};

    content = content.replace('{{studentName}}', studentName)
                     .replace('{{courseName}}', courseName)
                     .replace('{{certificationNumber}}', certificationNumber)
                     .replace('{{completionDate}}', new Date().toLocaleDateString('en-US', options))
                     .replace('{{primaryDetail}}', details.primary)
                     .replace('{{secondaryDetail}}', details.secondary)
                     
    await page.setContent(content);
  
    const pdfPath = path.join(__dirname, '../certificate/certificates', `${certificationNumber}.pdf`);
  
    await page.pdf({
      path: pdfPath,
      format: 'letter',
      landscape: true,
      printBackground: true,
    });
  
    await browser.close();
    return pdfPath;
  };

const mailjetClient = mailjet.apiConnect(
    process.env.MAILJET_API_KEY, 
    process.env.MAILJET_SECRET_KEY
  );
  
  async function sendCertificateEmail(to, certificatePath) {
    try {
      const attachmentContent = fs.readFileSync(certificatePath).toString('base64');
  
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
            TextPart: "Congratulations on completing your course! Please find your certificate attached.",
            Attachments: [
                {
                  "ContentType": "application/pdf",
                  "Filename": path.basename(certificatePath),
                  "Base64Content": fs.readFileSync(certificatePath).toString('base64')
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
