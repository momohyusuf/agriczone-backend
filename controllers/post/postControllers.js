const { StatusCodes } = require('http-status-codes');
const Post = require('../../models/postsModel');
const cloudinary = require('cloudinary');
const fs = require('fs');

const createPost = async (req, res) => {
  const post = req.body.text;
  const { firstName, lastName, profilePicture } = req.body;

  let newPost;
  let result;

  if (!post && !req.files.image) {
    throw new BadRequestError('field cant be empty');
  }

  const imageMaxSize = 5000000;

  if (req?.files?.image) {
    if (!req.files.image.mimetype.startsWith('image')) {
      throw new BadRequestError('Image file only');
    }

    if (req.files.image.size > imageMaxSize) {
      throw new BadRequestError('Image cannot be greater than 5mb');
    }
    result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
      use_filename: true,
      folder: 'agriczone-post',
      colors: true,
      transformation: [
        { fetch_format: 'webp' },
        { gravity: 'auto:face', crop: 'fill' },
        { height: 350, width: 350, crop: 'fit' },
      ],
    });
    fs.unlinkSync(req.files.image.tempFilePath);
  }
  if (req.user.accountType === 'AgroExpert') {
    newPost = await Post.create({
      firstName,
      lastName,
      profilePicture,
      post: post,
      image: result?.secure_url,
      public_id: result?.public_id,
      expert: req.user._id,
    });
  } else {
    newPost = await Post.create({
      firstName,
      lastName,
      profilePicture,
      post: post,
      image: result?.secure_url,
      public_id: result?.public_id,
      trader: req.user._id,
    });
  }

  res.status(StatusCodes.CREATED).json(newPost);
};

const getAllPost = async (req, res) => {
  // from chatGPT
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalCount = await Post.countDocuments();

  const hasMore = totalCount > page * limit;

  res.status(StatusCodes.OK).json({
    posts,
    hasMore,
  });
};

module.exports = {
  createPost,
  getAllPost,
};
