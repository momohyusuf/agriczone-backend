const crypto = require('crypto');

const generateToken = () => {
  const tokenLength = 32; // Length of the token in bytes
  return crypto.randomBytes(tokenLength).toString('hex');
};

module.exports = generateToken;
