const express = require('express');
const {
  createPost,
  getAllPost,
} = require('../controllers/post/postControllers');
const router = express.Router();

const authenticateUser = require('../middlewares/authenticateUser');

router.post('/create-post', authenticateUser, createPost);
router.get('/all-posts', getAllPost);

module.exports = router;
