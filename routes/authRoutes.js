const express = require('express');
const router = express.Router();

const loginUser = require('../controllers/auth/loginUser');
const registerAgroExpert = require('../controllers/auth/registerAgroExpert');
const verifyEmail = require('../controllers/auth/verifyEmail');
const registerAgroTrader = require('../controllers/auth/registerAgroTrader');
const forgotPassword = require('../controllers/auth/forgotPassword');
const resetPassword = require('../controllers/auth/resetPassword');
const showCurrentUser = require('../controllers/auth/showCurrentUser');
const logoutUser = require('../controllers/auth/logutUser');
// *******************
const authenticateUser = require('../middlewares/authenticateUser');
const deleteUserAccount = require('../controllers/auth/deleteUserAccount');

// routes
router.get('/show-current-user', authenticateUser, showCurrentUser);
// registration routes
// *********
router.post('/register-agro-expert', registerAgroExpert);
router.post('/register-agro-trader', registerAgroTrader);
// ***************
// *****************************
router.post('/verify-email', verifyEmail);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
//*******************

router.delete('/delete-user-account', authenticateUser, deleteUserAccount);
router.delete('/logout-user', authenticateUser, logoutUser);

module.exports = router;
