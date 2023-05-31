const createJwtToken = require('./createJwtWebToken');

// previous token set up
const sendTokenWithResponse = async (user, refreshToken) => {
  // create jwt
  const accessTokenJwt = createJwtToken({ user, duration: '1d' });
  const refreshTokenJwt = createJwtToken({
    user,
    refreshToken,
    duration: '30d',
  });

  return {
    accessTokenJwt,
    refreshTokenJwt,
  };
};

module.exports = sendTokenWithResponse;
