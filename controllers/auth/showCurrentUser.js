const AgroExpert = require('../../models/agroExpertModel');
const AgroTrader = require('../../models/agroTraderModel');

const showCurrentUser = async (req, res) => {
  const userId = req.user._id;

  if (req.user.accountType === 'AgroExpert') {
    const agroExpertUser = await AgroExpert.findOne({ _id: userId }).select(
      'profileBio profilePicture fullName _id accountType isPremiumUser role'
    );
    return res.status(200).json({ user: agroExpertUser });
  } else {
    const agroTraderUser = await AgroTrader.findOne({ _id: userId }).select(
      'profileBio profilePicture fullName _id accountType isPremiumUser role'
    );
    res.status(200).json({ user: agroTraderUser });
  }
};

module.exports = showCurrentUser;
