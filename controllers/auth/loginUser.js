const AgroExpert = require('../../models/agroExpertModel');
const AgroTrader = require('../../models/agroTraderModel');
const BadRequestError = require('../../errors/badRequestError');
const UnAuthenticatedError = require('../../errors/unAuthenticatedError');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const agroExpertTokenModel = require('../../models/agroExpertTokenModel');
const agroTraderTokenModel = require('../../models/agroTraderTokenModel');
const validator = require('validator');
const createJwtToken = require('../../utils/createJwtWebToken');
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  //   check if user has provided both email and password
  if (!email || !password) {
    throw new BadRequestError('Please provide your login details');
  }

  //   find user
  const agroExpertUser = await AgroExpert.findOne({
    email: validator.trim(email.toLowerCase()),
  });
  const agroTraderUser = await AgroTrader.findOne({
    email: validator.trim(email.toLowerCase()),
  });

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
  const {
    _id,
    fullName,
    email,
    accountType,
    profileBio,
    profilePicture,
    isPremiumUser,
  } = user;

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

  //  this is the user info to send and also use it to create the user token
  const userInfo = {
    _id,
    fullName,
    accountType,
    profileBio,
    profilePicture,
    isPremiumUser,
    email,
  };

  // check if the user already has an existing token
  const existingToken = await tokenModel.findOne({ user: user._id });

  // verify that the token is still valid
  const payload = jwt.verify(existingToken.token, process.env.JWT_SECRET);
  // check if existing token is still valid
  if (existingToken && payload) {
    res.status(StatusCodes.OK).json({ userInfo, token: existingToken.token });
    return;
  }

  // create the new jason web token
  const token = await createJwtToken(userInfo);

  // create a new token for first time users logging in
  const userAgent = req.headers['user-agent'];
  const ipAddress = req.ip;
  await tokenModel.create({
    token,
    userAgent,
    ipAddress,
    user: user._id,
  });

  res.status(StatusCodes.OK).json({ userInfo, token });
};

module.exports = loginUser;
