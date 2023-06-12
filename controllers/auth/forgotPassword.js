const { StatusCodes } = require('http-status-codes');
const BadRequestError = require('../../errors/badRequestError');
const AgroExpert = require('../../models/agroExpertModel');
const AgroTrader = require('../../models/agroTraderModel');
const generateToken = require('../../utils/generateToken');
const { sendPasswordResetEmail } = require('../../utils/sendEmail');

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new BadRequestError('provide your email address');
  }
  const origin = req.headers.origin;
  const passwordToken = generateToken();
  const agroExpertUser = await AgroExpert.findOne({ email });
  const agroTraderUser = await AgroTrader.findOne({ email });

  const link = `${origin}/password_reset?token=${passwordToken}&email=${email}`;
  // const html = `
  // <p>
  // Cannot access your agric zone account? use the forgot password link to reset your password <br/>
  // <a href=${origin}/password?token=${passwordToken}&email=${email} target=_blank>Click here</a>
  // </p>
  // <p> Password reset link expires in 10 minutes </p>
  // <div>
  // <img src="https://res.cloudinary.com/starkweb/image/upload/v1677051239/agriczone/agric_zone_logo_uagtar.png" height=100px width=100px />
  // </div>
  // `;

  // check if the user is registered as an agro expert user
  if (agroExpertUser) {
    // set the password reset expiration time to 10 minutes from request time
    agroExpertUser.passwordTokenExpirationDate = new Date(
      Date.now() + 10 * 60 * 1000
    );

    agroExpertUser.passwordToken = passwordToken;
    // send password reset link if the user exist
    sendPasswordResetEmail(email, link);
    await agroExpertUser.save();
    res
      .status(StatusCodes.OK)
      .json({ message: `Password reset link sent to ${req.body.email}` });
    return;
  }

  // check if the user is registered as an agro trader
  if (agroTraderUser) {
    // set the password reset expiration time to 10 minutes from request time
    agroTraderUser.passwordTokenExpirationDate = new Date(
      Date.now() + 10 * 60 * 1000
    );
    // send password reset link if the user exist

    agroTraderUser.passwordToken = passwordToken;
    sendPasswordResetEmail(email, link);

    await agroTraderUser.save();
  }

  res
    .status(StatusCodes.OK)
    .json({ message: `Password reset link sent to ${req.body.email}` });
};

module.exports = forgotPassword;
