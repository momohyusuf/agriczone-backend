const BadRequestError = require('../../errors/badRequestError');
const cloudinary = require('cloudinary').v2;
const { StatusCodes } = require('http-status-codes');
const fs = require('fs');
const AgroTrader = require('../../models/agroTraderModel');
const AgroExpert = require('../../models/agroExpertModel');

const uploadProfilePicture = async (req, res) => {
  const userId = req.user._id;
  const { publicId } = req.query;

  // Step 1: check if the user already uploaded a picture to cloudinary already, if yes delete it so you can update to the current one, if you don't delete the old image it will only be eating up the cloud storage for no reason
  if (publicId) {
    await cloudinary.uploader.destroy(publicId);
  }
  const profilePicture = req.files.image;

  const imageMaxSize = 5000000;
  if (!profilePicture) {
    throw new BadRequestError('Please upload a file');
  }
  if (!profilePicture.mimetype.startsWith('image')) {
    throw new BadRequestError('Image file only');
  }

  if (profilePicture.size > imageMaxSize) {
    throw new BadRequestError('Image cannot be greater than 5mb');
  }

  // step 2 upload the user new image  to cloudinary
  const result = await cloudinary.uploader.upload(profilePicture.tempFilePath, {
    use_filename: true,
    folder: 'agriczone-users',
    colors: true,
    transformation: [
      { fetch_format: 'webp' },
      { gravity: 'auto:face', crop: 'fill' },
      { height: 350, width: 350, crop: 'fit' },
    ],
  });

  fs.unlinkSync(profilePicture.tempFilePath);

  //Step 3: update the user database information with the new image
  // update the user profile picture details to the uploaded picture
  if (req.user.accountType === 'AgroTrader') {
    const user = await AgroTrader.findOne({ _id: userId });
    user.profilePicture = {
      image: result.secure_url,
      public_id: result.public_id,
      colors: result.colors,
    };
    await user.save();
    return res
      .status(StatusCodes.CREATED)
      .json({ message: 'Profile picture successfully updated' });
  } else {
    const user = await AgroExpert.findOne({ _id: userId });

    user.profilePicture = {
      image: result.secure_url,
      public_id: result.public_id,
      colors: result.colors,
    };
    await user.save();
    return res
      .status(StatusCodes.CREATED)
      .json({ message: 'Profile picture successfully updated' });
  }
};

module.exports = {
  uploadProfilePicture,
};
