const mongoose = require('mongoose');

const PostSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    post: {
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', PostSchema);
