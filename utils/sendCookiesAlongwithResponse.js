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
    signed: true,
    domain: '.agriczone.vercel.app',
    sameSite: 'lax',
  });
  res.cookie('refreshToken', refreshTokenJwt, {
    expires: new Date(Date.now() + oneDay * 30),
    signed: true,
    domain: '.agriczone.vercel.com',
    sameSite: 'lax',
  });
};

module.exports = sendCookiesAlongWithResponse;
