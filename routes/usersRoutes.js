const express = require('express');
const {
  uploadProfilePicture,
} = require('../controllers/file-upload/profilePicture');
// agro expert user
const {
  singleAgroExpertUser,
  updateUserCoverImage,
  updateUserProfileBio,
  updateUserJobExperience,
  deleteJobExperience,
  updateEducation,
  deleteEducation,
  updateCertificateAndLicense,
  deleteCertificateAndLicenses,
  allAgroExpertUser,
} = require('../controllers/users/agroExpertUsers');
// agro trader
const {
  singleAgroTraderUser,
  updateAgroTraderUserCoverImage,
  updateAgroTraderUserProfileBio,
  allAgroTraderUsers,
} = require('../controllers/users/agroTraderUsers');

// All users

const { filterUsersByName } = require('../controllers/users/filterUsersByName');
const authenticateUser = require('../middlewares/authenticateUser');
const {
  featuredAgroExperts,
} = require('../controllers/users/featuredExpertUsers');
const router = express.Router();

// agro Expert user
router.get('/agro-expert', singleAgroExpertUser);
router.get('/agro-expert-users', allAgroExpertUser);
router.get('/agro-expert/featured-experts', featuredAgroExperts);
// update profile
router.patch(
  '/profile-update/cover-image',
  authenticateUser,
  updateUserCoverImage
);
router.patch(
  '/profile-update/profile-bio',
  authenticateUser,
  updateUserProfileBio
);
router.patch(
  '/profile-update/job-experience',
  authenticateUser,
  updateUserJobExperience
);
router.delete(
  '/profile-update/job-experience-delete',
  authenticateUser,
  deleteJobExperience
);

router.patch('/profile-update/education', authenticateUser, updateEducation);

router.delete(
  '/profile-update/education-delete',
  authenticateUser,
  deleteEducation
);

router.patch(
  '/profile-update/certificate-and-license',
  authenticateUser,
  updateCertificateAndLicense
);
router.delete(
  '/profile-update/certificate-and-license-delete',
  authenticateUser,
  deleteCertificateAndLicenses
);

// agro trader user
router.get('/agro-trader', singleAgroTraderUser);
router.get('/agro-trader-users', allAgroTraderUsers);
router.patch(
  '/profile-update/agro-trader/cover-image',
  authenticateUser,
  updateAgroTraderUserCoverImage
);

router.patch(
  '/profile-update/agro-trader-profile-bio',
  authenticateUser,
  updateAgroTraderUserProfileBio
);

// upload routes
router.patch(
  '/profile-update/profile-picture-upload',
  authenticateUser,
  uploadProfilePicture
);

// all users routes
router.get('/', filterUsersByName);
module.exports = router;
