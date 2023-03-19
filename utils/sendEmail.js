const nodemailer = require('nodemailer');

const sendEmail = async (userEmail, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    secure: false,
    auth: {
      user: process.env.SEND_MAIL_USER,
      pass: process.env.SEND_MAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Agric Zone" <starkweb2@gmail.com>`,
    to: `${userEmail}`,
    subject: `${subject}`,
    html: `${html}`,
  });
};

module.exports = sendEmail;
