const jwt = require('jsonwebtoken');
const UnAuthenticatedError = require('../errors/unAuthenticatedError');
const agroExpertTokenModel = require('../models/agroExpertTokenModel');
const agroTraderTokenModel = require('../models/agroTraderTokenModel');

const authenticateUser = async (req, res, next) => {
  //  get the token from the headers
  const token = req.headers.authorization.split(' ')[1];

  try {
    // check if token is a valid jason web token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) {
      throw new UnAuthenticatedError('Authentication Invalid');
    }

    // verify that the token was indeed created by a user on our data base

    // check if the user that created the token was an agro expert
    const agroExpertToken = await agroExpertTokenModel.findOne({
      user: payload._id,
      token: token,
    });

    // check if the user that created the token was an agro trader
    const agroTraderToken = await agroTraderTokenModel.findOne({
      user: payload._id,
      token: token,
    });

    if (!agroExpertToken && !agroTraderToken) {
      throw new UnAuthenticatedError('Authentication Invalid');
    }

    req.user = payload;
    next();
  } catch (error) {
    throw new UnAuthenticatedError('Authentication Invalid');
  }
};

module.exports = authenticateUser;
