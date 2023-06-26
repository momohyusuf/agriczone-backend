const { StatusCodes } = require('http-status-codes');
const AgroTrader = require('../../models/agroTraderModel');
const AgroExpert = require('../../models/agroExpertModel');

const filterUsersByName = async (req, res) => {
  const { fullName, state, userType } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 15;
  const skip = (page - 1) * limit;
  console.log(fullName);

  // create a default query object

  let queryObject = {
    userVerified: true,
  };

  if (fullName.trim()) {
    queryObject.fullName = fullName.trim().toLowerCase();
  }
  if (state !== 'null' && state !== '') {
    queryObject.state = state;
  }

  // users pipeline

  // agro expert pipeline
  const agroExpertPipeline = [
    {
      $match: {
        fullName: { $regex: new RegExp(queryObject.fullName, 'i') },
        state: { $regex: new RegExp(queryObject.state, 'i') },
      },
    },

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
  ];

  const agroTraderPipeline = [
    {
      $match: {
        fullName: { $regex: new RegExp(queryObject.fullName, 'i') },
        state: { $regex: new RegExp(queryObject.state, 'i') },
      },
    },
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
  ];

  // if user want to search for a user that is only an agro expert
  if (userType === 'Agro expert') {
    const users = await AgroExpert.aggregate(agroExpertPipeline);
    const totalCount = await AgroExpert.countDocuments(queryObject);
    const hasMore = totalCount > page * limit;
    res.status(StatusCodes.OK).json({ users, hasMore });
    return;
  }

  // if user only want to search for a user that is an agro trader
  if (userType === 'Agro trader') {
    const users = await AgroTrader.aggregate(agroTraderPipeline);
    const totalCount = await AgroTrader.countDocuments(queryObject);
    const hasMore = totalCount > page * limit;
    res.status(StatusCodes.OK).json({ users, hasMore });
    return;
  }

  // Execute the aggregation on both user models
  const agroExpertUsers = await AgroExpert.aggregate(agroExpertPipeline);
  const agroTraderUsers = await AgroTrader.aggregate(agroTraderPipeline);

  const users = [...agroExpertUsers, ...agroTraderUsers];
  const totalCount = users.length;
  const hasMore = totalCount > page * limit;

  res.status(StatusCodes.OK).json({ users, hasMore });
};

module.exports = { filterUsersByName };
