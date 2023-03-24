const BadRequestError = require('../../errors/badRequestError');
const UnAuthenticatedError = require('../../errors/unAuthenticatedError');
const { StatusCodes } = require('http-status-codes');
const AgroTrader = require('../../models/agroTraderModel');

const singleAgroTraderUser = async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    throw new BadRequestError('user id is required');
  }
  const user = await AgroTrader.findOne({ _id: userId }).select(
    '-password -acceptAgreement -isAccountBlocked -verificationToken'
  );
  res.status(StatusCodes.OK).json(user);
};

const updateAgroTraderUserCoverImage = async (req, res) => {
  const userId = req.user._id;
  const user = await AgroTrader.findOne({ _id: userId });
  if (!user) {
    throw new UnAuthenticatedError('Invalid credentials');
  }
  user.coverImage = req.body?.coverImage;
  await user.save();
  res.status(StatusCodes.OK).json({ message: 'Account successfully updated' });
};

//
const updateAgroTraderUserProfileBio = async (req, res) => {
  const userId = req.user._id;
  const user = await AgroTrader.findOne({ _id: userId });
  const {
    bioData: { phoneNumber, state, profileBio, agriculturalProducts },
  } = req.body;
  //
  if (!user) {
    throw new UnAuthenticatedError('Invalid credentials');
  }
  user.phoneNumber = phoneNumber;
  user.state = state;
  user.profileBio = profileBio;
  user.agriculturalProducts = agriculturalProducts;
  await user.save();

  res.status(StatusCodes.OK).json({ message: 'Account successfully updated' });
};

// ***********************

// update user Education

// ***********************

module.exports = {
  singleAgroTraderUser,
  updateAgroTraderUserCoverImage,
  updateAgroTraderUserProfileBio,
};
