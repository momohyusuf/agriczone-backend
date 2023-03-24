const AgroExpert = require('../../models/agroExpertModel');
const AgroTrader = require('../../models/agroTraderModel');
const BadRequestError = require('../../errors/badRequestError');
const UnAuthenticatedError = require('../../errors/unAuthenticatedError');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');
const sendCookiesAlongWithResponse = require('../../utils/sendCookiesAlongwithResponse');
const generateToken = require('../../utils/generateToken');
const agroExpertTokenModel = require('../../models/agroExpertTokenModel');
const agroTraderTokenModel = require('../../models/agroTraderTokenModel');

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  //   check if user has provided both email and password
  if (!email || !password) {
    throw new BadRequestError('Please provide your login details');
  }

  //   find user
  const agroExpertUser = await AgroExpert.findOne({ email: email });
  const agroTraderUser = await AgroTrader.findOne({ email: email });

  // check if user account exist using the email address
  if (!agroExpertUser && !agroTraderUser) {
    throw new UnAuthenticatedError(`Account with ${email} does not exist`);
  }

  // check if its an agro expert
  if (agroExpertUser) {
    logUserInBasedOnAccountType(
      req,
      res,
      agroExpertUser,
      password,
      agroExpertTokenModel
    );
    return;
  }

  // ******************
  // ******************

  // check if it is an agroTrader
  if (agroTraderUser) {
    logUserInBasedOnAccountType(
      req,
      res,
      agroTraderUser,
      password,
      agroTraderTokenModel
    );
    return;
  }
};

// this function was created so it can be reused when logging  as an agro expert or agro trader
const logUserInBasedOnAccountType = async (
  req,
  res,
  user,
  password,
  tokenModel
) => {
  const { _id, firstName, lastName, accountType, profileBio, profilePicture } =
    user;

  // compare the user password with the hashed password already in the database
  const comparePassword = await bcrypt.compare(password, user.password);

  //   check if password is correct
  if (!comparePassword) {
    // throw new UnAuthenticatedError('Incorrect password');
    res.status(403).json({ message: 'Incorrect password' });
    return;
  }

  // check if user has verified their account already
  if (!user.userVerified) {
    res.status(403).json({ message: 'Please verify your account' });
    return;
  }

  let refreshToken = '';
  // check if user already created a refresh token

  const existingToken = await tokenModel.findOne({ user: user._id });

  if (existingToken) {
    refreshToken = existingToken.refreshToken;
    await sendCookiesAlongWithResponse(res, user, refreshToken);
    res.status(StatusCodes.OK).json({
      _id,
      firstName,
      lastName,
      accountType,
      profileBio,
      profilePicture,
    });
    return;
  }

  refreshToken = generateToken();
  const userAgent = req.headers['user-agent'];
  const platform = req.headers['sec-ch-ua-platform'];
  const ipAddress = req.ip;

  await tokenModel.create({
    refreshToken,
    userAgent,
    platform,
    ipAddress,
    user: user._id,
  });

  await sendCookiesAlongWithResponse(res, user, refreshToken);
  res.status(StatusCodes.OK).json({
    _id,
    firstName,
    lastName,
    accountType,
    profileBio,
    profilePicture,
  });
};

module.exports = loginUser;
