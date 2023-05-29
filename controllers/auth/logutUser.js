const logoutUser = async (req, res) => {
  // for new updated browsers
  res.cookie('accessToken', '', {
    expires: new Date(Date.now()),
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
  });
  res.cookie('refreshToken', '', {
    expires: new Date(Date.now()),
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
  });

  // for old browsers
  // setting cookies for old browsers
  res.cookie('accessTokenLegacy', '', {
    expires: new Date(Date.now()),
    httpOnly: true,
    signed: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });

  res.cookie('refreshTokenLegacy', '', {
    expires: new Date(Date.now()),
    httpOnly: true,
    signed: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });
  res.status(200).json({ message: `Account logged out` });
};

module.exports = logoutUser;
