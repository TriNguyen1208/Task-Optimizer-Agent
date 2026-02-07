import transporter from '#@/configs/mailer.js';

const sendMail = async ({ from, to, subject, text, html }) => {
  await transporter.sendMail({
    from: from || `"Task Optimizer" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html,
  });
};

export default sendMail;