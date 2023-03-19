const mongoose = require('mongoose');

const AgroTraderTokenSchema = mongoose.Schema(
  {
    refreshToken: {
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
    platform: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'AgroTrader',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AgroTraderToken', AgroTraderTokenSchema);
