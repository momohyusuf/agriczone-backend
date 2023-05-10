const { StatusCodes } = require('http-status-codes');
const Post = require('../../models/postsModel');
const Comment = require('../../models/commentModel');
// const AgroExpert = require('../../models/agroExpertModel');
// const cloudinary = require('cloudinary').v2;
// const fs = require('fs');
const BadRequestError = require('../../errors/badRequestError');

const createComment = async (req, res) => {
  const { user, postID, comment } = req.body;

  if (!user || !postID || !comment) {
    throw new BadRequestError('invalid request');
  }

  const {
    fullName,
    isPremiumUser,
    profilePicture: { image },
    accountType,
  } = user;

  let newComment;

  if (req.user.accountType === 'AgroExpert') {
    newComment = await Comment.create({
      fullName,
      isPremiumUser,
      profilePicture: image,
      accountType,
      comment,
      postId: postID,
      expert: req.user._id,
    });
  } else {
    newComment = await Comment.create({
      fullName,
      isPremiumUser,
      profilePicture: image,
      accountType,
      comment,
      postId: postID,
      trader: req.user._id,
    });
  }
  const post = await Post.findById({ _id: postID });
  post.comments.push(newComment);
  await post.save();
  res.status(StatusCodes.CREATED).json(post);
};

const getPostComments = async (req, res) => {
  const { id } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 15;
  const skip = (page - 1) * limit;

  const comments = await Comment.find({ postId: id }).skip(skip).limit(limit);

  const totalCount = await Comment.countDocuments({ postId: id });
  const hasMore = totalCount > page * limit;
  res.status(StatusCodes.OK).json({
    comments,
    hasMore,
  });
};

module.exports = {
  createComment,
  getPostComments,
};
