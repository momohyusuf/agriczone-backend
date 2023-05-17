const BadRequestError = require('../../errors/badRequestError');
const UnAuthenticatedError = require('../../errors/unAuthenticatedError');
const { StatusCodes } = require('http-status-codes');
const AgroTrader = require('../../models/agroTraderModel');
const AgroExpert = require('../../models/agroExpertModel');

const filterUsersByName = async (req, res) => {
  // from chatGPT

  const { fullName, state, userType } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 15;
  const skip = (page - 1) * limit;

  // -----

  let queryObject = {
    userVerified: true,
  };

  if (fullName.trim()) {
    queryObject.fullName = fullName.trim().toLowerCase();
  }
  if (state !== 'null' && state !== '') {
    queryObject.state = state;
  }
  // this for Agro experts users
  if (userType === 'Agro expert' || userType === 'null' || userType === '') {
    const users = await AgroExpert.aggregate([
      { $match: queryObject },
      { $addFields: { random: { $rand: {} } } },
      { $sort: { isPremiumUser: -1, random: 1 } },
      {
        $project: {
          coverImage: 1,
          field: 1,
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
    const totalCount = await AgroExpert.countDocuments(queryObject);
    const hasMore = totalCount > page * limit;
    res.status(StatusCodes.OK).json({ users, hasMore });
  } else {
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
  }
};

module.exports = { filterUsersByName };
