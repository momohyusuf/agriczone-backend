const AgroExpert = require('../../models/agroExpertModel');
const AgroTrader = require('../../models/agroTraderModel');
const BadRequestError = require('../../errors/badRequestError');
const { StatusCodes } = require('http-status-codes');
const { sendAccountVerificationEmail } = require('../../utils/sendEmail');
const generateToken = require('../../utils/generateToken');
const verificationEmailTemplate = require('../../utils/verificationHtml');
const validator = require('validator');

const registerAgroExpert = async (req, res) => {
  // extract the required values from the req.body for security purpose
  const origin = req.headers.origin;

  const {
    fullName,
    phoneNumber,
    email,
    password,
    field,
    state,
    acceptAgreement,
  } = req.body;

  // check if all the values have been provided
  if (!fullName || !phoneNumber || !email || !password || !field || !state) {
    throw new BadRequestError('Please provide the required values');
  }

  // check if user accepted agreement
  if (!acceptAgreement) {
    throw new BadRequestError('Accept our terms and conditions to continue');
  }
  // check if userEmail is registered  already
  const agroExpertUser = await AgroExpert.findOne({ email });
  const agroTraderUser = await AgroTrader.findOne({ email });

  if (agroExpertUser || agroTraderUser) {
    throw new BadRequestError(`An account with ${email} already exist`);
  }

  // create the verification token for the user
  verificationToken = generateToken();

  // create the user account
  await AgroExpert.create({
    fullName: fullName.toLowerCase(),
    phoneNumber,
    email: email.toLowerCase(),
    password,
    field: validator.trim(field.toLowerCase()),
    state,
    acceptAgreement,
    verificationToken,
  });

  const link = `${origin}/verify/verify-email?token=${verificationToken}&email=${email}`;

  // previously used for nodemailer
  // Verification email template
  // const html = verificationEmailTemplate(
  //   fullName,
  //   origin,
  //   verificationToken,
  //   email
  // );

  // Send email the verification email address to the registered user email address

  // await sendEmail(email, 'Account Verification', html);

  await sendAccountVerificationEmail(email, link);

  res.status(StatusCodes.CREATED).json({
    message: 'Sign up successful. Check your email to verify your account.',
  });
};

module.exports = registerAgroExpert;
