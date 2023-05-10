const BadRequestError = require('../../errors/badRequestError');
const UnAuthenticatedError = require('../../errors/unAuthenticatedError');
const { StatusCodes } = require('http-status-codes');
const AgroExpert = require('../../models/agroExpertModel');

// ***************
// **************
const singleAgroExpertUser = async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    throw new BadRequestError('User id is required');
  }
  const user = await AgroExpert.findOne({ _id: userId }).select(
    '-password -acceptAgreement -isAccountBlocked -verificationToken'
  );
  res.status(StatusCodes.OK).json(user);
};
// ******************
// ******************

const allAgroExpertUser = async (req, res) => {
  // from chatGPT
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 15;
  const skip = (page - 1) * limit;

  let queryObject = {
    userVerified: true,
  };
  if (req.query.field !== 'null' && req.query.field !== '') {
    queryObject.field = req.query.field.toLowerCase();
  }
  if (req.query.state !== 'null' && req.query.state !== '') {
    queryObject.state = req.query.state;
  }

  const users = await AgroExpert.aggregate([
    { $match: queryObject },
    { $addFields: { random: { $rand: {} } } },
    { $sort: { isPremiumUser: -1, random: 1 } },
    {
      $project: {
        coverImage: 1,
        field: 1,
        fullName: 1,
        profileBio: 1,
        profilePicture: 1,
        state: 1,
        accountType: 1,
        isPremiumUser: 1,
      },
    },
    { $skip: skip },
    { $limit: limit },
  ]);
  const totalCount = await AgroExpert.countDocuments(queryObject);

  const hasMore = totalCount > page * limit;

  res.status(StatusCodes.OK).json({ users, hasMore });
};

const updateUserCoverImage = async (req, res) => {
  const userId = req.user._id;
  const user = await AgroExpert.findOne({ _id: userId });
  if (!user) {
    throw new UnAuthenticatedError('Invalid credentials');
  }
  user.coverImage = req.body?.coverImage;
  await user.save();
  res.status(StatusCodes.OK).json({ message: 'Cover photo updated' });
};

//
const updateUserProfileBio = async (req, res) => {
  const userId = req.user._id;
  const user = await AgroExpert.findOne({ _id: userId });
  const {
    bioData: { phoneNumber, state, profileBio },
  } = req.body;
  //
  if (!user) {
    throw new UnAuthenticatedError('Invalid credentials');
  }
  user.phoneNumber = phoneNumber;
  user.state = state;
  user.profileBio = profileBio;
  await user.save();

  res.status(StatusCodes.OK).json({ message: 'Profile bio updated' });
};

//
// job experience section
const updateUserJobExperience = async (req, res) => {
  const userId = req.user._id;
  const user = await AgroExpert.findOne({ _id: userId });
  const {
    jobTitle,
    employmentType,
    companyName,
    location,
    startDate,
    endDate,
    jobDescription,
  } = req.body;

  if (!user) {
    throw new UnAuthenticatedError('Invalid credentials');
  }
  user.jobExperience.push({
    jobTitle,
    employmentType,
    companyName,
    location,
    startDate,
    endDate,
    jobDescription,
  });
  await user.save();
  res.status(StatusCodes.OK).json({ message: 'Job experience updated' });
};

// delete job experience
const deleteJobExperience = async (req, res) => {
  const userId = req.user._id;
  const { jobId } = req.query;

  const user = await AgroExpert.updateOne(
    { _id: userId }, // Specify the document to update
    { $pull: { jobExperience: { _id: jobId } } }
  );

  res.status(StatusCodes.OK).json({ message: 'Deleted successfully' });
};
// ***********************
// ***********************

// update user Education

const updateEducation = async (req, res) => {
  const userId = req.user._id;
  const user = await AgroExpert.findOne({ _id: userId });
  const { school, degree, fieldOfStudy, startDate, endDate } = req.body;

  if (!user) {
    throw new UnAuthenticatedError('Invalid credentials');
  }
  user.education.push({
    school,
    degree,
    fieldOfStudy,
    startDate,
    endDate,
  });
  await user.save();
  res.status(StatusCodes.OK).json({ message: 'Education updated' });
};

// delete education
const deleteEducation = async (req, res) => {
  const userId = req.user._id;
  const { educationId } = req.query;

  const user = await AgroExpert.updateOne(
    { _id: userId }, // Specify the document to update
    { $pull: { education: { _id: educationId } } }
  );

  res.status(StatusCodes.OK).json({ message: 'Deleted successfully' });
};
// ***********************
// ***********************

const updateCertificateAndLicense = async (req, res) => {
  const userId = req.user._id;
  const user = await AgroExpert.findOne({ _id: userId });
  const { name, issuingOrganization, credentialUrl, issuedDate } = req.body;

  if (!user) {
    throw new UnAuthenticatedError('Invalid credentials');
  }
  user.certificateAndLicense.push({
    name,
    issuingOrganization,
    credentialUrl,
    issuedDate,
  });
  await user.save();
  res
    .status(StatusCodes.OK)
    .json({ message: 'License and certificate updated' });
};

const deleteCertificateAndLicenses = async (req, res) => {
  const userId = req.user._id;
  const { certificateAndLicenseId } = req.query;

  const user = await AgroExpert.updateOne(
    { _id: userId }, // Specify the document to update
    { $pull: { certificateAndLicense: { _id: certificateAndLicenseId } } }
  );

  res.status(StatusCodes.OK).json({ message: 'deleted successfully' });
};

module.exports = {
  singleAgroExpertUser,
  allAgroExpertUser,
  updateUserCoverImage,
  updateUserProfileBio,
  updateUserJobExperience,
  deleteJobExperience,
  updateEducation,
  deleteEducation,
  updateCertificateAndLicense,
  deleteCertificateAndLicenses,
};
