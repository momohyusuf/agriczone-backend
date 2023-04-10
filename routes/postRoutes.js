const express = require('express');
const {
  createPost,
  getAllPost,
  getSingleUserPosts,
} = require('../controllers/post/postControllers');
const router = express.Router();

const authenticateUser = require('../middlewares/authenticateUser');

router.post('/create-post', authenticateUser, createPost);
router.get('/all-posts', getAllPost);
router.get('/user-posts', getSingleUserPosts);

module.exports = router;
