const verificationEmailTemplate = (
  fullName,
  origin,
  verificationToken,
  email
) => {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>New Comment</title>
    <style>
     body {
      font-family: 'Open Sans', sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #444444;
      background-color: #f7f7f7;
      margin: 0;
      padding: 0;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px;
      border-radius: 4px;
      margin-top: 40px;
    }
    
    h1 {
      font-size: 24px;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 10px;
    }
    
    p {
      margin: 0 0 16px;
    }
    .notification {
      background-color: #f2f2f2;
      padding: 20px;
      border-radius: 4px;
    }
    
    .notification p {
      margin-bottom: 10px;
    }
    .logo {
      display: block;
      margin-top: 40px;
      text-align: center;
    }
    
    .logo img {
      height: 60px;
      width: 75px;
    }
    
    .team {
      text-align: center;
      margin-top: 10px;
      color: #888888;
    }
      
    </style>
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap" rel="stylesheet">
  </head>
  <body>
  
  <main class="container">
      <h1>Verify Your Account</h1>
      <div class="notification">
      <p>Hello ${fullName},</p>
      <p>Thank you for creating an account with Agric zone! To complete the registration process, please click the link below to verify your email address:</p>
      <p><a href=${origin}/verify/verify-email?token=${verificationToken}&email=${email} target=_blank>click here</a></p>
      <p>If you did not create an account with us, please ignore this email.</p>
      <p>Thank you,</p>
    </div>
     <div class="logo">
        <img
      src=https://res.cloudinary.com/starkweb/image/upload/v1677051239/agriczone/agric_zone_logo_uagtar.png height=75px width=75px
      />
     </div>
      <p class="team">The Agric zone team</p>
    </main>
   
    
  </body>
</html>
`;
};

module.exports = verificationEmailTemplate;
