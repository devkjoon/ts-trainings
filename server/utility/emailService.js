const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com', // For Outlook/Office 365
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.OUTLOOK_EMAIL, // Your personal email address
      pass: process.env.OUTLOOK_PASS  // Your personal email password or app password if MFA is enabled
    },
    tls: {
      ciphers: 'SSLv3'
    },
    logger: true,
    debug: true
  });

async function sendEmail(to, subject, text) {
    try {
      let info = await transporter.sendMail({
        from: '"Think Safety" <info@thinksafetyllcs.com>', // Sender address
        to: to, // Receiver address
        subject: subject, // Subject line
        text: text, // Plain text body
        replyTo: 'info@thinksafetyllcs.com' // Reply-to address
      });
  
      console.log('Message sent: %s', info.messageId);
      console.log('Email:', process.env.OUTLOOK_EMAIL);
      console.log('Password:', process.env.OUTLOOK_PASS);
      
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

module.exports = { sendEmail };