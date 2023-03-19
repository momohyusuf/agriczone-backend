const AgroTrader = require('../../models/agroTraderModel');
const AgroExpert = require('../../models/agroExpertModel');
const BadRequestError = require('../../errors/badRequestError');
const { StatusCodes } = require('http-status-codes');
const sendEmail = require('../../utils/sendEmail');
const generateToken = require('../../utils/generateToken');

const registerAgroExpert = async (req, res) => {
  // extract the required values from the req.body for security purpose
  const origin = req.headers.origin;

  const {
    firstName,
    lastName,
    phoneNumber,
    email,
    password,
    agriculturalProducts,
    state,
    acceptAgreement,
  } = req.body;

  // check if all the values have been provided

  if (
    !firstName ||
    !lastName ||
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
    firstName,
    lastName,
    phoneNumber,
    email,
    password,
    agriculturalProducts,
    state,
    acceptAgreement,
    verificationToken,
  });

  // verification email template
  const html = `
  <h4>Hello ${firstName + ' ' + lastName}</h4>
  <p>
  Thank you for registering to become part of Agric zone. <br/> Please verify your account
  <a href=${origin}/verify/verify-email/?token=${verificationToken}&email=${email} target=_blank>Click here</a>
  </p>

  <div>
  <img src="https://res.cloudinary.com/starkweb/image/upload/v1677051239/agriczone/agric_zone_logo_uagtar.png" height=100px width=100px />
  </div>
  
  `;
  //
  // send verification email to the registered user email address
  await sendEmail(email, 'Email Verification', html);

  res.status(StatusCodes.CREATED).json({
    message:
      'Account successfully created. Check your email to verify your account.',
  });
};

module.exports = registerAgroExpert;
