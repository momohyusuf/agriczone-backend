const jwt = require('jsonwebtoken');

const createJwtToken = (
  { _id, fullName, email, accountType },
  refreshToken
) => {
  return jwt.sign(
    {
      _id,
      fullName,
      email,
      accountType,
      refreshToken,
    },
    process.env.JWT_SECRET
  );
};

module.exports = createJwtToken;
