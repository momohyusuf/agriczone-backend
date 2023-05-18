const express = require('express');
const router = express.Router();

const {
  subscribeToPremium,
  unSubscribeToPremium,
} = require('../controllers/subscribeToPremium/subscribeToPremium');
const authenticateUser = require('../middlewares/authenticateUser');

router.patch('/subscribe-user', authenticateUser, subscribeToPremium);
router.patch('/unsubscribe-user', authenticateUser, unSubscribeToPremium);

module.exports = router;
