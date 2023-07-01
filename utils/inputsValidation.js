const BadRequestError = require('../errors/badRequestError');
const validator = require('validator');

// this funtion is to validate the post job inputs
const validatePostJobInputs = (postJobData) => {
  if (validator.isEmpty(postJobData.jobTitle)) {
    throw new BadRequestError('Job title is required');
  }
  if (
    postJobData.jobLocation == null ||
    validator.isEmpty(postJobData.jobLocation)
  ) {
    throw new BadRequestError('Job location is required');
  }
  if (postJobData.jobType === null || validator.isEmpty(postJobData.jobType)) {
    throw new BadRequestError('Job type is required');
  }
  if (
    postJobData.workplaceType === null ||
    validator.isEmpty(postJobData.workplaceType)
  ) {
    throw new BadRequestError('Workplace type is required');
  }
  if (validator.isEmpty(postJobData.jobDescription)) {
    throw new BadRequestError('Job description is required');
  }
  if (postJobData.minAmount && !validator.isCurrency(postJobData.minAmount)) {
    throw new BadRequestError('Provide a valid minimum amount');
  }

  if (postJobData.maxAmount && !validator.isCurrency(postJobData.maxAmount)) {
    throw new BadRequestError('Provide a valid maximum amount');
  }
  if (
    (!validator.isEmpty(postJobData.minAmount) ||
      !validator.isEmpty(postJobData.maxAmount)) &&
    validator.isEmpty(postJobData.paymentPeriod)
  ) {
    throw new BadRequestError('Please select a payment period');
  }

  if (validator.isEmpty(postJobData.companyName)) {
    throw new BadRequestError('Company name is required');
  }

  if (postJobData.companyLink && !validator.isURL(postJobData.companyLink)) {
    throw new BadRequestError('Provide a valid url');
  }
};

module.exports = {
  validatePostJobInputs,
};
