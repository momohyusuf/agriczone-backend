const mongoose = require('mongoose');

const jobPostSchema = mongoose.Schema(
  {
    jobTitle: {
      trim: true,
      type: String,
      required: true,
    },
    jobLocation: {
      trim: true,
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      trim: true,
      required: true,
    },
    jobType: {
      trim: true,
      type: String,
      required: true,
    },
    workplaceType: {
      trim: true,
      type: String,
      required: true,
    },
    salaryPayment: {
      minAmount: {
        type: Number,
      },
      maxAmount: {
        type: Number,
      },
      paymentPeriod: {
        type: String,
      },
    },
    skills: {
      trim: true,
      type: [String],
    },

    companyName: {
      type: String,
      required: true,
    },
    companyLink: {
      type: String,
    },
    companyDescription: {
      type: String,
    },
    companyLogo: {
      image: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('JobPost', jobPostSchema);
