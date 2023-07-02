const mongoose = require('mongoose');

const reportSchema = mongoose.Schema(
  {
    reportReason: {
      trim: true,
      type: String,
      required: true,
    },
    reportDetails: {
      trim: true,
      type: String,
      required: true,
    },
    reportType: {
      trim: true,
      type: String,
      required: true,
    },
    reportedContentId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Report', reportSchema);
