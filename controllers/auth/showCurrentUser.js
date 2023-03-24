const AgroExpert = require('../../models/agroExpertModel');
const AgroTrader = require('../../models/agroTraderModel');

const showCurrentUser = async (req, res) => {
  const userId = req.user._id;

  if (req.user.accountType === 'AgroExpert') {
    const agroExpertUser = await AgroExpert.findOne({ _id: userId }).select(
      'profileBio profilePicture firstName lastName _id accountType'
    );
    return res.status(200).json({ user: agroExpertUser || agroTraderUser });
  } else {
    const agroTraderUser = await AgroTrader.findOne({ _id: userId }).select(
      'profileBio profilePicture firstName lastName _id accountType'
    );
    res.status(200).json({ user: agroExpertUser || agroTraderUser });
  }
};

module.exports = showCurrentUser;
