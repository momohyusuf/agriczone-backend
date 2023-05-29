const logoutUser = async (req, res) => {
  // for new updated browsers
  res.cookie('accessToken', '', {
    expires: new Date(Date.now()),
    signed: true,
    sameSite: 'lax',
  });
  res.cookie('refreshToken', '', {
    expires: new Date(Date.now()),
    signed: true,
    sameSite: 'lax',
  });

  // for old browse
  res.status(200).json({ message: `Account logged out` });
};

module.exports = logoutUser;
