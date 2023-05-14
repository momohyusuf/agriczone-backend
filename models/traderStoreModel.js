const mongoose = require('mongoose');

const TraderStoreSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: ['product uploader name is required', true],
    },
    isPremiumUser: {
      type: Boolean,
      required: ['product user value is required is required', true],
    },
    productTitle: {
      type: String,
      required: ['product name is required', true],
      trim: true,
    },
    productDescription: {
      type: String,
    },
    price: {
      type: String,
      required: ['price is required', true],
      trim: true,
    },
    productPriceNegotiable: {
      type: Boolean,
      default: false,
    },
    public_id: {
      type: String,
    },
    address: {
      type: String,
    },
    productImage: {
      type: String,
      required: ['product picture is required', true],
    },
    trader: {
      type: mongoose.Types.ObjectId,
      ref: 'AgroTrader',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('TraderStore', TraderStoreSchema);
