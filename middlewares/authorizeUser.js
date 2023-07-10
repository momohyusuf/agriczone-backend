const UnAuthorizedError = require('../errors/unAuthorizedError');

const authorizePermission = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      throw new UnAuthorizedError('Permission to access these data declined');
    }
    next();
  };
};

module.exports = authorizePermission;
