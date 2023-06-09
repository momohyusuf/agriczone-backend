const mongoose = require('mongoose');

const AgroExpertTokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },

    user: {
      type: mongoose.Types.ObjectId,
      ref: 'AgroExpert',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AgroExpertToken', AgroExpertTokenSchema);
