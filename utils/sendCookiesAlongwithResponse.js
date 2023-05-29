const createJwtToken = require('./createJwtWebToken');

const sendCookiesAlongWithResponse = async (res, user, refreshToken) => {
  // create jwt
  const accessTokenJwt = await createJwtToken(user);
  const refreshTokenJwt = await createJwtToken(user, refreshToken);

  // this is to make the access token have a lifespan of just oneHour
  const oneHour = 3600000;
  // this is to make the refresh token have a life span of 30days
  const oneDay = 86400000;
  res.cookie('accessToken', accessTokenJwt, {
    expires: new Date(Date.now() + oneHour),
    // httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
  });
  res.cookie('refreshToken', refreshTokenJwt, {
    expires: new Date(Date.now() + oneDay * 30),
    // httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
  });
};

module.exports = sendCookiesAlongWithResponse;
