const jwt = require('jsonwebtoken');
const UnAuthenticatedError = require('../errors/unAuthenticatedError');
const agroExpertTokenModel = require('../models/agroExpertTokenModel');
const agroTraderTokenModel = require('../models/agroTraderTokenModel');
const sendCookiesAlongWithResponse = require('../utils/sendCookiesAlongwithResponse');

const authenticateUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;

  try {
    if (accessToken) {
      const payload = await jwt.verify(accessToken, process.env.JWT_SECRET);
      req.user = payload;
      return next();
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const agroExpertToken = await agroExpertTokenModel.findOne({
      user: payload._id,
      refreshToken: payload.refreshToken,
    });

    const agroTraderToken = await agroTraderTokenModel.findOne({
      user: payload._id,
      refreshToken: payload.refreshToken,
    });

    if (!agroExpertToken && !agroTraderToken) {
      console.log('validation error here');
      throw new UnAuthenticatedError('Authentication Invalid');
    }
    // ***************
    let token;
    if (agroExpertToken) {
      token = agroExpertToken.refreshToken;
    } else {
      token = agroTraderToken.refreshToken;
    }

    await sendCookiesAlongWithResponse(res, payload, token);
    req.user = payload;
    next();
  } catch (error) {
    throw new UnAuthenticatedError('Authentication Invalid');
  }
};

module.exports = authenticateUser;
