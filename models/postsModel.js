const mongoose = require('mongoose');

const PostSchema = mongoose.Schema(
  {
    fullName: {
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
    authorEmail: {
      type: String,
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
    colors: {
      type: Array,
    },
    trader: {
      type: mongoose.Types.ObjectId,
      ref: 'AgroTrader',
    },
    expert: {
      type: mongoose.Types.ObjectId,
      ref: 'AgroExpert',
    },
    comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
  },
  {
    timestamps: true,
  }
);
// PostSchema.virtual('commentCount').get(function () {
//   return this.comments.length;
// });

module.exports = mongoose.model('Post', PostSchema);
