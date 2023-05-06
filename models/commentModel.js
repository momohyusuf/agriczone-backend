const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    isPremiumUser: {
      type: Boolean,
    },
    accountType: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    comment: {
      type: String,
    },
    public_id: {
      type: String,
    },
    image: {
      type: String,
    },
    trader: {
      type: mongoose.Types.ObjectId,
      ref: 'AgroTrader',
    },
    expert: {
      type: mongoose.Types.ObjectId,
      ref: 'AgroExpert',
    },
    postId: {
      type: mongoose.Types.ObjectId,
      ref: 'Post',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Comment', CommentSchema);
