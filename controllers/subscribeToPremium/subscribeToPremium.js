const BadRequestError = require('../../errors/badRequestError');
const AgroExpert = require('../../models/agroExpertModel');
const AgroTrader = require('../../models/agroTraderModel');
const Posts = require('../../models/postsModel');
const TraderStore = require('../../models/traderStoreModel');
const Comment = require('../../models/commentModel');
const { StatusCodes } = require('http-status-codes');

const subscribeToPremium = async (req, res) => {
  const { _id, accountType } = req.user;

  if (accountType === 'AgroTrader') {
    await AgroTrader.findOneAndUpdate(
      { _id: _id },
      {
        isPremiumUser: true,
      }
    );

    await Posts.findOneAndUpdate(
      { trader: _id },
      {
        isPremiumUser: true,
      }
    );

    await Comment.findOneAndUpdate(
      { trader: _id },
      {
        isPremiumUser: true,
      }
    );
    await TraderStore.findOneAndUpdate(
      { trader: _id },
      {
        isPremiumUser: true,
      }
    );
  } else {
    await AgroExpert.findOneAndUpdate(
      { _id: _id },
      {
        isPremiumUser: true,
      }
    );

    await Posts.findOneAndUpdate(
      { expert: _id },
      {
        isPremiumUser: true,
      }
    );

    await Comment.findOneAndUpdate(
      { expert: _id },
      {
        isPremiumUser: true,
      }
    );
  }

  res
    .status(StatusCodes.CREATED)
    .json({ message: 'Successfully unsubscribed' });
};

const unSubscribeToPremium = async (req, res) => {
  const { _id, accountType } = req.user;

  if (accountType === 'AgroTrader') {
    await AgroTrader.findOneAndUpdate(
      { _id: _id },
      {
        isPremiumUser: false,
      }
    );

    await Posts.findOneAndUpdate(
      { trader: _id },
      {
        isPremiumUser: false,
      }
    );

    await Comment.findOneAndUpdate(
      { trader: _id },
      {
        isPremiumUser: false,
      }
    );
    await TraderStore.findOneAndUpdate(
      { trader: _id },
      {
        isPremiumUser: false,
      }
    );
  } else {
    await AgroExpert.findOneAndUpdate(
      { _id: _id },
      {
        isPremiumUser: true,
      }
    );

    await Posts.findOneAndUpdate(
      { expert: _id },
      {
        isPremiumUser: true,
      }
    );

    await Comment.findOneAndUpdate(
      { expert: _id },
      {
        isPremiumUser: true,
      }
    );
  }

  res.status(StatusCodes.CREATED).json({ message: 'Successful unsubscribed' });
};

module.exports = {
  subscribeToPremium,
  unSubscribeToPremium,
};
