const express = require('express');
const {
  singleAgroExpertUser,
  updateUserCoverImage,
  updateUserProfileBio,
  updateUserJobExperience,
  deleteJobExperience,
  updateEducation,
  deleteEducation,
} = require('../controllers/users/agroExpertUsers');
const authenticateUser = require('../middlewares/authenticateUser');
const router = express.Router();

router.get('/agro-expert', singleAgroExpertUser);

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

module.exports = router;
