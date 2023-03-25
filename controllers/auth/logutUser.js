const logoutUser = async (req, res) => {
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
  res.status(200).json({ message: `Account logged out` });
};

module.exports = logoutUser;
