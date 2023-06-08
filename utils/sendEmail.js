// const nodemailer = require('nodemailer');
const { MailtrapClient } = require('mailtrap');

const ENDPOINT = 'https://send.api.mailtrap.io/';
const client = new MailtrapClient({
  endpoint: ENDPOINT,
  token: process.env.TOKEN,
});

// sending email using mailtrap
const sendPasswordResetEmail = async (userEmail, link) => {
  const sender = { name: 'Agric zone', email: 'info@agriczone.com' };

  try {
    const response = await client.send({
      from: sender,
      to: [{ email: userEmail }],
      template_uuid: 'b3bff63e-288d-4d70-998b-0fe7bfc2b659',
      template_variables: {
        user_email: userEmail,
        pass_reset_link: link,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const sendAccountVerificationEmail = async (userEmail, fullName, link) => {
  const sender = { name: 'Agric zone', email: 'info@agriczone.com' };

  try {
    const response = await client.send({
      from: sender,
      to: [{ email: userEmail }],
      template_uuid: '87c54a01-7917-4c5b-a699-ae7b432e0b99',
      template_variables: {
        user_fullName: fullName,
        verification_link: link,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const sendCommentNotificationEmail = async (
  userEmail,
  fullName,
  comment,
  link
) => {
  console.log(userEmail, fullName, comment, link);
  const sender = { name: 'Agric zone', email: 'info@agriczone.com' };

  try {
    const response = await client.send({
      from: sender,
      to: [{ email: userEmail }],
      template_uuid: '9ec75a56-d8d9-4585-b257-500e2feb3700',
      template_variables: {
        user_fullName: fullName,
        comment: comment,
        post_link: link,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendAccountVerificationEmail,
  sendCommentNotificationEmail,
};

// sending email using nodemailer
// const sendEmail = async (userEmail, subject, html) => {
//   console.log(process.env.SEND_MAIL_USER, process.env.SEND_MAIL_PASSWORD);
//   const transporter = nodemailer.createTransport({
//     host: 'live.smtp.mailtrap.io',
//     port: 25,
//     auth: {
//       user: process.env.SEND_MAIL_USER,
//       pass: process.env.SEND_MAIL_PASSWORD,
//     },
//   });

//   try {
//     await transporter.sendMail({
//       from: `"Agric Zone" <info@agriczone.com>`,
//       to: `${userEmail}`,
//       subject: `${subject}`,
//       html: `${html}`,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
