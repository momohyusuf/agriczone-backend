const logoutUser = async (req, res) => {
  // for new updated browsers
  res.cookie('accessToken', '', {
    expires: new Date(Date.now()),
    signed: true,
    sameSite: 'lax',
    httpOnly: true, // Add the httpOnly flag
    secure: true, // Consider adding the secure flag if served over HTTPS
  });
  res.cookie('refreshToken', '', {
    expires: new Date(Date.now()),
    signed: true,
    sameSite: 'lax',
    httpOnly: true, // Add the httpOnly flag
    secure: true, // Consider adding the secure flag if served over HTTPS
  });

  // for old browse
  res.status(200).json({ message: `Account logged out` });
};

module.exports = logoutUser;
