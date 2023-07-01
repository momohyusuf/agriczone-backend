const { StatusCodes } = require('http-status-codes');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const BadRequestError = require('../../errors/badRequestError');
const { validatePostJobInputs } = require('../../utils/inputsValidation');
const JobPost = require('../../models/jobPostModel');
const {
  removeCommaFromCurrencyValue,
} = require('../../utils/removeComafromCurrencyValue');

const createJob = async (req, res) => {
  const {
    jobTitle,
    jobLocation,
    jobDescription,
    jobType,
    workplaceType,
    skills,
    companyName,
    companyLink,
    companyDescription,
    minAmount,
    maxAmount,
    paymentPeriod,
  } = req.body;
  const companyLogo = req?.files?.companyLogo;
  validatePostJobInputs(req.body);

  const imageMaxSize = 5000000;

  if (companyLogo && !companyLogo.mimetype.startsWith('image')) {
    throw new BadRequestError('Image file only');
  }

  if (companyLogo && companyLogo.size > imageMaxSize) {
    throw new BadRequestError('Image cannot be greater than 5mb');
  }
  let result;
  if (companyLogo) {
    // step 2 upload the user new image  to cloudinary
    result = await cloudinary.uploader.upload(companyLogo.tempFilePath, {
      use_filename: true,
      folder: 'agriczone-users',
      colors: true,
      transformation: [
        { fetch_format: 'webp' },
        { gravity: 'auto:face', crop: 'fill' },
        { height: 550, width: 550, crop: 'fit' },
      ],
    });

    fs.unlinkSync(companyLogo.tempFilePath);
    const newJob = await JobPost.create({
      jobTitle,
      jobLocation,
      jobDescription,
      jobType,
      workplaceType,
      skills,
      companyName,
      companyLink,
      companyDescription,
      salaryPayment: {
        minAmount: removeCommaFromCurrencyValue(minAmount),
        maxAmount: removeCommaFromCurrencyValue(maxAmount),
        paymentPeriod,
      },
      paymentPeriod,
      companyLogo: { image: result.secure_url, public_id: result.public_id },
    });

    res.status(StatusCodes.CREATED).json({ newJob });
    return;
  }

  const newJob = await JobPost.create({
    jobTitle,
    jobLocation,
    jobDescription,
    jobType,
    workplaceType,
    skills,
    companyName,
    companyLink,
    companyDescription,
    salaryPayment: {
      minAmount: removeCommaFromCurrencyValue(minAmount),
      maxAmount: removeCommaFromCurrencyValue(maxAmount),
      paymentPeriod,
    },
  });

  res.status(StatusCodes.CREATED).json({ newJob });
};

const getAllJobs = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 15;
  const skip = (page - 1) * limit;
  const { jobTitle, jobLocation, companyName, jobType, workplaceType } =
    req.query;

  const queryObject = {};

  if (jobTitle) {
    queryObject.jobTitle = jobTitle;
  }
  if (jobLocation !== 'null' || '') {
    queryObject.jobLocation = jobLocation;
  }

  if (companyName) {
    queryObject.companyName = companyName;
  }
  if (jobType !== 'null' || '') {
    queryObject.jobType = jobType;
  }

  if (workplaceType !== 'null' || '') {
    queryObject.workplaceType = workplaceType;
  }

  const jobs = await JobPost.find({
    jobTitle: { $regex: new RegExp(queryObject.jobTitle, 'i') },
    jobLocation: { $regex: new RegExp(queryObject.jobLocation, 'i') },
    companyName: { $regex: new RegExp(queryObject.companyName, 'i') },
    jobType: { $regex: new RegExp(queryObject.jobType, 'i') },
    workplaceType: { $regex: new RegExp(queryObject.workplaceType, 'i') },
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalCount = await JobPost.countDocuments();

  const hasMore = totalCount > page * limit;

  res.status(StatusCodes.OK).json({
    jobs,
    hasMore,
  });
};

const getSingleJobById = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const job = await JobPost.findOne({ _id: id });
  res.status(StatusCodes.OK).json({ job });
};

module.exports = {
  getSingleJobById,
  createJob,
  getAllJobs,
};
