const createJwtToken = require('./createJwtWebToken');

const sendCookiesAlongWithResponse = async (res, user, refreshToken) => {
  // create jwt
  const accessTokenJwt = await createJwtToken(user);
  const refreshTokenJwt = await createJwtToken(user, refreshToken);

  // this is to make the access token have a lifespan of just oneHour
  const oneHour = 3600000;
  // this is to make the refresh token have a life span of 30days
  const oneDay = 86400000;

  // setting cookies for updated browsers like chrome, firefox e.t.c
  res.cookie('accessToken', accessTokenJwt, {
    expires: new Date(Date.now() + oneHour),
    httpOnly: true,
    signed: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
  });

  res.cookie('refreshToken', refreshTokenJwt, {
    expires: new Date(Date.now() + oneDay * 30),
    httpOnly: true,
    signed: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
  });

  // setting cookies for old browsers
  res.cookie('accessTokenLegacy', accessTokenJwt, {
    expires: new Date(Date.now() + oneHour),
    httpOnly: true,
    signed: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });

  res.cookie('refreshTokenLegacy', refreshTokenJwt, {
    expires: new Date(Date.now() + oneDay * 30),
    httpOnly: true,
    signed: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });
};

module.exports = sendCookiesAlongWithResponse;
