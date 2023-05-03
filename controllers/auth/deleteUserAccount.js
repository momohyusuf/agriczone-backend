const BadRequestError = require('../../errors/badRequestError');
const AgroExpert = require('../../models/agroExpertModel');
const AgroTrader = require('../../models/agroTraderModel');
const traderLoginToken = require('../../models/agroTraderModel');
const expertLoginToken = require('../../models/agroExpertTokenModel');
const Posts = require('../../models/postsModel');
const TraderStore = require('../../models/traderStoreModel');
const deleteUserAccount = async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    throw new BadRequestError('invalid credentials');
  }

  if (req.user.accountType === 'AgroExpert') {
    await AgroExpert.findOneAndDelete({ _id: userId });
    await expertLoginToken.deleteMany({ user: userId });
    await Posts.deleteMany({ expert: userId });
    res.cookie('accessToken', '', {
      expires: new Date(Date.now()),
      httpOnly: true,
      signed: true,
      // secure: process.env.NODE_ENV === 'production',
      // sameSite: 'None',
    });
    res.cookie('refreshToken', '', {
      expires: new Date(Date.now()),
      httpOnly: true,
      signed: true,
      // secure: process.env.NODE_ENV === 'production',
      // sameSite: 'None',
    });
    return res.status(200).json({ message: `Account deleted` });
  } else {
    await AgroTrader.findOneAndDelete({ _id: userId });
    await traderLoginToken.deleteMany({ user: userId });
    await Posts.deleteMany({ trader: userId });
    await TraderStore.deleteMany({ trader: userId });
    res.cookie('accessToken', '', {
      expires: new Date(Date.now()),
      httpOnly: true,
      signed: true,
      // secure: process.env.NODE_ENV === 'production',
      // sameSite: 'None',
    });
    res.cookie('refreshToken', '', {
      expires: new Date(Date.now()),
      httpOnly: true,
      signed: true,
      // secure: process.env.NODE_ENV === 'production',
      // sameSite: 'None',
    });
    res.status(200).json({ message: `Account deleted` });
  }
};

module.exports = deleteUserAccount;
