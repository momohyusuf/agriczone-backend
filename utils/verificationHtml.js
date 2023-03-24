const verificationEmailTemplate = ({
  firstName,
  lastName,
  origin,
  verificationToken,
  email,
}) => {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Account Verification</title>
    <style>
      body {
        font-family: 'Open Sans', sans-serif;
        font-size: 16px;
        line-height: 1.6;
        color: #444444;
      }
      h1 {
        font-size: 28px;
        font-weight: 700;
        margin-top: 0;
      }
      p {
        margin: 0 0 16px;
      }
      a {
        color: #007bff;
        text-decoration: underline;
      }
    </style>
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap" rel="stylesheet">
  </head>
  <body>
    <h1>Verify Your Account</h1>
    <p>Hello,${firstName} ${lastName}</p>
    <p>Thank you for creating an account with our service! To complete the registration process, please click the link below to verify your email address:</p>
    <p><a href=${origin}/verify/verify-email?token=${verificationToken}&email=${email} target=_blank>click here</a></p>
    <p>If you did not create an account with us, please ignore this email.</p>
    <p>Thank you,</p>
    <img
    src=https://res.cloudinary.com/starkweb/image/upload/v1677051239/agriczone/agric_zone_logo_uagtar.png" height=75px width=75px
    />
    <p>The Agric zone Team</p>
  </body>
</html>
`;
};

module.exports = verificationEmailTemplate;
