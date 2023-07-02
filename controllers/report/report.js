const { StatusCodes } = require('http-status-codes');
const Report = require('../../models/reportModel');
const BadRequestError = require('../../errors/badRequestError');

const createReport = async (req, res) => {
  const { reportReason, reportDetails, reportType, reportedContentId } =
    req.body;

  if (!reportReason || !reportDetails || !reportType || !reportedContentId) {
    throw new BadRequestError('Invalid request provide the required values');
  }

  const report = await Report.create({
    reportReason,
    reportDetails,
    reportType,
    reportedContentId,
  });

  res.status(StatusCodes.OK).json({
    message:
      'Report successfully submitted. Thank you for helping keep Agric zone safe',
  });
};

module.exports = {
  createReport,
};
