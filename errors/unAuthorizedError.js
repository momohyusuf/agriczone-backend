const { StatusCodes } = require('http-status-codes');
const CustomError = require('./customError');

class UnAuthorizedError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = UnAuthorizedError;
