const { StatusCodes } = require('http-status-codes');
const BadRequestError = require('../../errors/badRequestError');
const AgroExpert = require('../../models/agroExpertModel');
const AgroTrader = require('../../models/agroTraderModel');

const resetPassword = async (req, res) => {
  const { email, token, confirmPassword } = req.body;

  if (!email || !token || !confirmPassword) {
    throw new BadRequestError('Invalid Credentials');
  }

  const agroExpertUser = await AgroExpert.findOne({ email });
  const agroTraderUser = await AgroTrader.findOne({ email });

  // set the current time to a variable
  const currentTime = new Date();

  // check if the user is registered as an agro expert user
  if (agroExpertUser) {
    // check if the reset link is within the 10 minutes reset time by comparing the time the reset link was requested against the current time.
    if (agroExpertUser.passwordTokenExpirationDate < currentTime) {
      throw new BadRequestError('Password reset link expired');
    }
    //save new password
    agroExpertUser.password = confirmPassword;
    agroExpertUser.passwordToken = null;
    agroExpertUser.passwordTokenExpirationDate = null;
    agroExpertUser.save();
  }
  // *********************
  // *********************

  // check if the user is registered as an agro trader
  if (agroTraderUser) {
    // check if the reset link is within the 10 minutes reset time by comparing the time the reset link was requested against the current time.
    if (agroTraderUser.passwordTokenExpirationDate < currentTime) {
      throw new BadRequestError('Password reset link expired');
    }

    //save new password
    agroTraderUser.password = confirmPassword;
    agroTraderUser.passwordToken = null;
    agroTraderUser.passwordTokenExpirationDate = null;
    agroTraderUser.save();
  }

  res.status(StatusCodes.OK).json({
    message: `Password Reset Successfully, Proceed To Sign In`,
  });
};

module.exports = resetPassword;
