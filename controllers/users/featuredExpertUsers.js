const { StatusCodes } = require('http-status-codes');

const AgroExpert = require('../../models/agroExpertModel');

const featuredAgroExperts = async (req, res) => {
  const users = await AgroExpert.find({ featuredExpertUser: true }).select(
    'accountType coverImage field fullName isPremiumUser profileBio profilePicture state _id'
  );
  res.status(StatusCodes.OK).json({ users });
};

module.exports = { featuredAgroExperts };
