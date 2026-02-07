import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import nodeMailer from 'nodemailer';


let transporter;

// ========== Gmail cá nhân  ==========
if (process.env.MAIL_SERVICE === 'gmail') {
  transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// SMTP Server công ty (bữa sau hỏi chú) ==========
else {
  transporter = nodeMailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}
(async () => {
  try {
    await transporter.verify();
    console.log('Mailer connected: ready to send emails');
  } catch (err) {
    console.error('Mailer connection failed:', err.message);
  }
})();

export default transporter;
