const { StatusCodes } = require('http-status-codes');
const Post = require('../../models/postsModel');
const AgroExpert = require('../../models/agroExpertModel');
const Comment = require('../../models/commentModel');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const BadRequestError = require('../../errors/badRequestError');

// function to create a new post
const createPost = async (req, res) => {
  const post = req.body.text;
  const { fullName, profilePicture, accountType, isPremiumUser, authorEmail } =
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
      fullName,
      isPremiumUser,
      profilePicture,
      accountType,
      authorEmail,
      post: post,
      image: result?.secure_url,
      public_id: result?.public_id,
      expert: req.user._id,
      colors: result.colors,
    });
  } else {
    newPost = await Post.create({
      fullName,
      authorEmail,
      isPremiumUser,
      profilePicture,
      accountType,
      post: post,
      image: result?.secure_url,
      public_id: result?.public_id,
      trader: req.user._id,
      colors: result.colors,
    });
  }

  res.status(StatusCodes.CREATED).json(newPost);
};

// function to get all the posts made by users
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

// function to get all the post attached to a single user account
const getSingleUserPosts = async (req, res) => {
  const userId = req.query.userId;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 15;
  const skip = (page - 1) * limit;
  // fetch posts based on the user posts a user is requesting
  const user = await AgroExpert.findOne({ _id: userId }).select('accountType');

  if (user) {
    const posts = await Post.find({ expert: userId })
      .populate('comments')
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
      .populate('comments')
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

// a Function to delete post
const deletePost = async (req, res) => {
  const { id } = req.params;
  const { public_id } = req.query;

  // step one find the post by id
  const posts = await Post.findOne({ _id: id });

  // step 2 check if the post has comments
  // if the post has comments delete all the comments from the data base attached to that post
  if (posts.comments.length !== 0) {
    await Comment.deleteMany({ _id: { $in: posts.comments } });
    await Post.updateOne({ _id: id }, { $set: { comments: [] } });
  }
  // step three check if the post has an image and also delete it from cloudinary data base
  if (public_id) {
    await cloudinary.uploader.destroy(public_id);
  }

  //  finally delete the entire post
  await Post.deleteOne({ _id: id });

  res.status(StatusCodes.OK).json({
    message: 'Post deleted',
  });
};

// function to fetch single post
const singlePost = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new BadRequestError('Post id is required');
  }
  const post = await Post.findOne({ _id: id });
  res.status(StatusCodes.OK).json(post);
};
module.exports = {
  createPost,
  getAllPost,
  getSingleUserPosts,
  deletePost,
  singlePost,
};
