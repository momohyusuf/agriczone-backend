const AgroTrader = require('../../models/agroTraderModel');
const AgroExpert = require('../../models/agroExpertModel');
const BadRequestError = require('../../errors/badRequestError');
const { StatusCodes } = require('http-status-codes');
const sendEmail = require('../../utils/sendEmail');
const generateToken = require('../../utils/generateToken');
const verificationEmailTemplate = require('../../utils/verificationHtml');

const registerAgroExpert = async (req, res) => {
  // extract the required values from the req.body for security purpose
  const origin = req.headers.origin;

  const {
    fullName,
    phoneNumber,
    email,
    password,
    agriculturalProducts,
    state,
    acceptAgreement,
  } = req.body;

  // check if all the values have been provided

  if (
    !fullName ||
    !email ||
    !password ||
    !phoneNumber ||
    !agriculturalProducts ||
    !state
  ) {
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
  await AgroTrader.create({
    fullName: fullName.toLowerCase(),
    phoneNumber,
    email,
    password,
    agriculturalProducts: agriculturalProducts.map((item) =>
      item.toLowerCase()
    ),
    state,
    acceptAgreement,
    verificationToken,
  });

  // verification email template
  const html = verificationEmailTemplate(
    fullName,
    origin,
    verificationToken,
    email
  );

  //
  // send verification email to the registered user email address
  await sendEmail(email, 'Email Verification', html);

  res.status(StatusCodes.CREATED).json({
    message:
      'Account successfully created. Check your email to verify your account.',
  });
};

module.exports = registerAgroExpert;
