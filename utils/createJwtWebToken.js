const jwt = require('jsonwebtoken');

const createJwtToken = async (payload) => {
  const { _id, fullName, email, accountType } = payload;
  return jwt.sign(
    {
      _id,
      fullName,
      email,
      accountType,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

module.exports = createJwtToken;
