const UnAuthenticatedError = require('../../errors/unAuthenticatedError');
const AgroExpert = require('../../models/agroExpertModel');
const AgroTrader = require('../../models/agroTraderModel');

const verifyEmail = async (req, res) => {
  // get the verification token and email from the incoming request
  const { email, verificationToken } = req.body;

  //   check if both email and VT was present in the request
  if (!email || !verificationToken) {
    throw new UnAuthenticatedError('Invalid Credentials');
  }

  //   find user
  const agroExpertUser = await AgroExpert.findOne({ email: email });
  const agroTraderUser = await AgroTrader.findOne({ email: email });

  // check if the user account actually exist
  if (!agroExpertUser && !agroTraderUser) {
    throw new UnAuthenticatedError('Invalid Credentials');
  }

  if (agroExpertUser) {
    const verifyTokenIsCorrect =
      verificationToken === agroExpertUser.verificationToken;
    if (!verifyTokenIsCorrect) {
      throw new UnAuthenticatedError('Invalid Credentials');
    }
    //   once account has been verified reset verification token back to empty string to make reverification impossible
    agroExpertUser.userVerified = true;
    agroExpertUser.verificationToken = null;
    await agroExpertUser.save();
    res.status(200).json({ message: 'Account successfully Verified' });
    return;
  }

  if (agroTraderUser) {
    //   check if the sent token and the saved token on the database are correct
    const verifyTokenIsCorrect =
      verificationToken === agroTraderUser.verificationToken;
    if (!verifyTokenIsCorrect) {
      throw new UnAuthenticatedError('Invalid Credentials');
    }
    //   once account has been verified reset verification token back to empty string to make reverification impossible
    agroTraderUser.userVerified = true;
    agroTraderUser.verificationToken = null;
    await agroTraderUser.save();
    res.status(200).json({ message: 'Account successfully Verified' });
  }
};

module.exports = verifyEmail;
