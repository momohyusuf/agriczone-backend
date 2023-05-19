const BadRequestError = require('../../errors/badRequestError');
const AgroExpert = require('../../models/agroExpertModel');
const AgroTrader = require('../../models/agroTraderModel');
const Posts = require('../../models/postsModel');
const TraderStore = require('../../models/traderStoreModel');
const Comment = require('../../models/commentModel');
const { StatusCodes } = require('http-status-codes');

const subscribeToPremium = async (req, res) => {
  const { _id, accountType } = req.user;

  //   unsubscribe the user if the user is an agro trader
  if (accountType === 'AgroTrader') {
    // define your filter
    const filter = { trader: _id, isPremiumUser: false };
    // define what property to update
    const update = { $set: { isPremiumUser: true } };
    await AgroTrader.findOneAndUpdate(
      { _id: _id },
      {
        isPremiumUser: true,
      }
    );
    // update the posts
    await Posts.updateMany(filter, update);
    // update the comments
    await Comment.updateMany(filter, update);
    // update the trader store items
    await TraderStore.updateMany(filter, update);

    res
      .status(StatusCodes.CREATED)
      .json({ message: 'Successful subscribed agro trader' });
    return;
  }

  //  *****
  // ******
  // check if the user is an agro expert
  if (accountType === 'AgroExpert') {
    // define your filter
    const filter = { expert: _id, isPremiumUser: false };
    // define what property to update
    const update = { $set: { isPremiumUser: true } };
    await AgroExpert.findOneAndUpdate(
      { _id: _id },
      {
        isPremiumUser: true,
      }
    );
    // update the posts
    await Posts.updateMany(filter, update);
    // update the comments
    await Comment.updateMany(filter, update);

    res
      .status(StatusCodes.CREATED)
      .json({ message: 'Successful subscribed agro expert' });
  }
};

// *****************
// unsubscribe a user from premium
const unSubscribeToPremium = async (req, res) => {
  const { _id, accountType } = req.user;

  //   unsubscribe the user if the user is an agro trader
  if (accountType === 'AgroTrader') {
    // define your filter
    const filter = { trader: _id, isPremiumUser: true };
    // define what property to update
    const update = { $set: { isPremiumUser: false } };
    await AgroTrader.findOneAndUpdate(
      { _id: _id },
      {
        isPremiumUser: false,
      }
    );
    // update the posts
    await Posts.updateMany(filter, update);
    // update the comments
    await Comment.updateMany(filter, update);
    // update the trader store items
    await TraderStore.updateMany(filter, update);

    res
      .status(StatusCodes.CREATED)
      .json({ message: 'Successful unsubscribed agro trader' });
    return;
  }

  //  *****
  // ******
  // check if the user is an agro expert
  if (accountType === 'AgroExpert') {
    // define your filter
    const filter = { expert: _id, isPremiumUser: true };
    // define what property to update
    const update = { $set: { isPremiumUser: false } };
    await AgroExpert.findOneAndUpdate(
      { _id: _id },
      {
        isPremiumUser: false,
      }
    );
    // update the posts
    await Posts.updateMany(filter, update);
    // update the comments
    await Comment.updateMany(filter, update);

    res
      .status(StatusCodes.CREATED)
      .json({ message: 'Successful unsubscribed agro expert' });
  }
};

module.exports = {
  subscribeToPremium,
  unSubscribeToPremium,
};
