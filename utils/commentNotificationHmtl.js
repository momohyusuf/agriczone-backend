const commentNotificationEmailTemplate = (fullName, postLink, comment) => {
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
    <h1>New Comment</h1>
    <p><b>${fullName}</b> just commented you your post:</p>
    <p>"${comment}"</p>
    <p>${postLink}</p>
   
    <img
    src=https://res.cloudinary.com/starkweb/image/upload/v1677051239/agriczone/agric_zone_logo_uagtar.png height=75px width=75px
    />
    <p>The Agric zone team</p>
  </body>
</html>
`;
};

module.exports = commentNotificationEmailTemplate;
