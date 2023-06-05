const BadRequestError = require('../../errors/badRequestError');
const cloudinary = require('cloudinary').v2;
const { StatusCodes } = require('http-status-codes');
const fs = require('fs');
const AgroTrader = require('../../models/agroTraderModel');
const AgroExpert = require('../../models/agroExpertModel');
const Post = require('../../models/postsModel');
const Comment = require('../../models/commentModel');

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
      { height: 550, width: 550, crop: 'fit' },
    ],
  });

  fs.unlinkSync(profilePicture.tempFilePath);

  //Step 3: update the user database information with the new image
  // update the user profile picture details to the uploaded picture
  if (req.user.accountType === 'AgroTrader') {
    const user = await AgroTrader.findOne({ _id: userId });
    // update user post profile picture to the newly updated profile picture
    await Post.updateMany(
      { trader: userId },
      {
        $set: { profilePicture: result.secure_url },
      }
    );

    await Comment.updateMany(
      {
        trader: userId,
      },
      {
        profilePicture: result.secure_url,
      }
    );

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
    // update user post profile picture to the newly updated profile picture
    await Post.updateMany(
      { expert: userId },
      {
        $set: { profilePicture: result.secure_url },
      }
    );

    await Comment.updateMany(
      {
        expert: userId,
      },
      {
        profilePicture: result.secure_url,
      }
    );

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
