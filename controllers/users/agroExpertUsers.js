const BadRequestError = require('../../errors/badRequestError');
const UnAuthenticatedError = require('../../errors/unAuthenticatedError');
const { StatusCodes } = require('http-status-codes');
const AgroExpert = require('../../models/agroExpertModel');

const singleAgroExpertUser = async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    throw new BadRequestError('User id is required');
  }
  const user = await AgroExpert.findOne({ _id: userId }).select(
    '-password -acceptAgreement -isAccountBlocked -accountType -verificationToken'
  );
  res.status(StatusCodes.OK).json(user);
};

const updateUserCoverImage = async (req, res) => {
  const userId = req.user._id;
  const user = await AgroExpert.findOne({ _id: userId });
  if (!user) {
    throw new UnAuthenticatedError('Invalid credentials');
  }
  user.coverImage = req.body?.coverImage;
  await user.save();
  res.status(StatusCodes.OK).json({ message: 'Account successfully updated' });
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

  res.status(StatusCodes.OK).json({ message: 'Account successfully updated' });
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
  res.status(StatusCodes.OK).json({ message: 'Account successfully updated' });
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
  res.status(StatusCodes.OK).json({ message: 'Account successfully updated' });
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
// *

module.exports = {
  singleAgroExpertUser,
  updateUserCoverImage,
  updateUserProfileBio,
  updateUserJobExperience,
  deleteJobExperience,
  updateEducation,
  deleteEducation,
};
