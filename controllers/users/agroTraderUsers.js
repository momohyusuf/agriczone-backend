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
    '-password -acceptAgreement -isAccountBlocked -verificationToken -passwordToken -passwordTokenExpirationDate'
  );
  res.status(StatusCodes.OK).json(user);
};

const allAgroTraderUsers = async (req, res) => {
  // from chatGPT
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 15;
  const skip = (page - 1) * limit;

  let queryObject = {
    userVerified: true,
  };

  if (req.query.state !== 'null' && req.query.state !== '') {
    queryObject.state = req.query.state;
  }
  if (req.query.product !== 'null' && req.query.product !== '') {
    queryObject.agriculturalProducts = {
      $elemMatch: { $eq: req.query.product.toLowerCase().trim() },
    };
  }

  const users = await AgroTrader.aggregate([
    { $match: queryObject },
    { $addFields: { random: { $rand: {} } } },
    { $sort: { isPremiumUser: -1, random: 1 } },
    {
      $project: {
        coverImage: 1,
        agriculturalProducts: 1,
        fullName: 1,
        profileBio: 1,
        profilePicture: 1,
        state: 1,
        accountType: 1,
        isPremiumUser: 1,
      },
    },
    { $skip: skip },
    { $limit: limit },
  ]);

  const totalCount = await AgroTrader.countDocuments(queryObject);

  const hasMore = totalCount > page * limit;
  res.status(StatusCodes.OK).json({ users, hasMore });
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
    bioData: {
      phoneNumber,
      state,
      profileBio,
      agriculturalProducts,
      physicalAddress,
    },
  } = req.body;
  //
  if (!user) {
    throw new UnAuthenticatedError('Invalid credentials');
  }
  user.phoneNumber = phoneNumber;
  user.physicalAddress = physicalAddress;
  user.state = state;
  user.profileBio = profileBio;
  user.agriculturalProducts = agriculturalProducts.map((item) =>
    item.toLowerCase()
  );
  await user.save();

  res.status(StatusCodes.OK).json({ message: 'Account successfully updated' });
};

// ***********************
// ***********************

module.exports = {
  singleAgroTraderUser,
  allAgroTraderUsers,
  updateAgroTraderUserCoverImage,
  updateAgroTraderUserProfileBio,
};
