const express = require('express');
const router = express.Router();

const {
  createJob,
  getAllJobs,
  getSingleJobById,
} = require('../controllers/job-post/jobPost');

router.post('/create-new-job', createJob);
router.get('/', getAllJobs);

router.route('/:id').get(getSingleJobById);

module.exports = router;
