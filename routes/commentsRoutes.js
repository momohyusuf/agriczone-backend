const express = require('express');
const {
  createComment,
  getPostComments,
} = require('../controllers/comments/commentController');
const router = express.Router();

const authenticateUser = require('../middlewares/authenticateUser');

router.post('/create-comment', authenticateUser, createComment);
router.get('/:id', getPostComments);

module.exports = router;
