const { StatusCodes } = require('http-status-codes');
const Post = require('../../models/postsModel');
const AgroExpert = require('../../models/agroExpertModel');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const createPost = async (req, res) => {
  const post = req.body.text;
  const { firstName, lastName, profilePicture, accountType, isPremiumUser } =
    req.body;
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
        { height: 400, width: 400, crop: 'fit' },
      ],
    });
    fs.unlinkSync(req.files.image.tempFilePath);
  }
  if (req.user.accountType === 'AgroExpert') {
    newPost = await Post.create({
      firstName,
      lastName,
      isPremiumUser,
      profilePicture,
      accountType,
      post: post,
      image: result?.secure_url,
      public_id: result?.public_id,
      expert: req.user._id,
    });
  } else {
    newPost = await Post.create({
      firstName,
      lastName,
      isPremiumUser,
      profilePicture,
      accountType,
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
  const limit = Number(req.query.limit) || 15;
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

const getSingleUserPosts = async (req, res) => {
  const userId = req.query.userId;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 15;
  const skip = (page - 1) * limit;
  // fetch posts based on the user posts a user is requesting
  const user = await AgroExpert.findOne({ _id: userId }).select('accountType');

  if (user) {
    const posts = await Post.find({ expert: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalCount = await Post.countDocuments({ expert: userId });
    const hasMore = totalCount > page * limit;
    res.status(StatusCodes.OK).json({
      posts,
      hasMore,
    });
    return;
  } else {
    const posts = await Post.find({ trader: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalCount = await Post.countDocuments({ trader: userId });
    const hasMore = totalCount > page * limit;
    res.status(StatusCodes.OK).json({
      posts,
      hasMore,
    });
  }
};
const deletePost = async (req, res) => {
  const { id } = req.params;
  const { public_id } = req.query;

  await Post.deleteOne({ _id: id });

  if (public_id) {
    await cloudinary.uploader.destroy(public_id);
  }

  res.status(StatusCodes.OK).json({
    message: 'Post deleted',
  });
};
module.exports = {
  createPost,
  getAllPost,
  getSingleUserPosts,
  deletePost,
};
