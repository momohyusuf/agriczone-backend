const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AgroExpertSchema = mongoose.Schema(
  {
    coverImage: {
      trim: true,
      type: String,
      default: 'default-cover-image',
    },
    fullName: {
      trim: true,
      type: String,
      required: ['Provide your fast name', true],
      minLength: 2,
      maxLength: 30,
      trim: true,
    },
    isPremiumUser: {
      type: Boolean,
      default: false,
    },
    featuredExpertUser: {
      type: Boolean,
    },
    acceptEmailNotification: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },

    profileBio: {
      type: String,
      default: '',
    },

    phoneNumber: {
      type: String,
      trim: true,
      required: ['please provide your phone number', true],
    },
    profilePicture: {
      image: {
        type: String,
        default:
          'https://res.cloudinary.com/starkweb/image/upload/v1681074042/agriczone/no-profile-picture_r1k66b.jpg',
      },
      public_id: '',
      colors: [],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: ['Please provide your email address', true],
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Provide a valid email address',
      ],
    },

    password: {
      type: String,
      trim: true,
      required: ['please provide a password', true],
      match: [
        /(?=^.{6,}$)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).*/,
        'Provide should contain, Uppercase, lowercase, special character, number length should be 8 or greater than',
      ],
    },
    state: {
      trim: true,
      type: String,
      required: ['please provided your state', true],
    },
    field: {
      trim: true,
      type: String,
      required: ['Please provide your field', true],
    },
    acceptAgreement: {
      type: Boolean,
    },
    accountType: {
      type: String,
      default: 'AgroExpert',
    },

    userVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: String,
    verified: {
      type: Date,
    },
    isAccountBlocked: {
      type: Boolean,
      default: false,
    },
    passwordToken: {
      type: String,
    },
    passwordTokenExpirationDate: {
      type: Date,
    },
    jobExperience: [
      {
        jobTitle: String,
        employmentType: String,
        companyName: String,
        location: String,
        startDate: Date,
        endDate: Date,
        jobDescription: String,
      },
    ],
    education: [
      {
        school: String,
        degree: String,
        fieldOfStudy: String,
        startDate: String,
        endDate: String,
      },
    ],
    certificateAndLicense: [
      {
        name: String,
        issuingOrganization: String,
        credentialUrl: String,
        issuedDate: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

AgroExpertSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const AgroExpert = mongoose.model('AgroExpert', AgroExpertSchema);

module.exports = AgroExpert;
