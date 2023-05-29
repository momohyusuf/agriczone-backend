const jwt = require('jsonwebtoken');
const UnAuthenticatedError = require('../errors/unAuthenticatedError');
const agroExpertTokenModel = require('../models/agroExpertTokenModel');
const agroTraderTokenModel = require('../models/agroTraderTokenModel');
const sendCookiesAlongWithResponse = require('../utils/sendCookiesAlongwithResponse');

const authenticateUser = async (req, res, next) => {
  const { accessToken, refreshToken, refreshTokenLegacy, accessTokenLegacy } =
    req.signedCookies;

  try {
    // check if accessToken is present or accessLegacyToken
    if (accessToken || accessTokenLegacy) {
      // assign payload to either of the token available
      const payload = accessToken
        ? jwt.verify(accessToken, process.env.JWT_SECRET)
        : jwt.verify(accessTokenLegacy, process.env.JWT_SECRET);
      req.user = payload;
      return next();
    }

    // check if access token has expired
    const payload = refreshToken
      ? jwt.verify(refreshToken, process.env.JWT_SECRET)
      : jwt.verify(refreshTokenLegacy, process.env.JWT_SECRET);

    const agroExpertToken = await agroExpertTokenModel.findOne({
      user: payload._id,
      refreshToken: payload.refreshToken,
    });

    const agroTraderToken = await agroTraderTokenModel.findOne({
      user: payload._id,
      refreshToken: payload.refreshToken,
    });

    if (!agroExpertToken && !agroTraderToken) {
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
