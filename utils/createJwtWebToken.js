const jwt = require('jsonwebtoken');

const createJwtToken = (
  { _id, firstName, lastName, email, accountType },
  refreshToken
) => {
  return jwt.sign(
    {
      _id,
      firstName,
      lastName,
      email,
      accountType,
      refreshToken,
    },
    process.env.JWT_SECRET
  );
};

module.exports = createJwtToken;
