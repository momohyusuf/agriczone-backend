const { StatusCodes } = require('http-status-codes');
const Post = require('../../models/postsModel');
const Comment = require('../../models/commentModel');
// const AgroExpert = require('../../models/agroExpertModel');
// const cloudinary = require('cloudinary').v2;
// const fs = require('fs');
const BadRequestError = require('../../errors/badRequestError');

const createComment = async (req, res) => {
  const { user, postId, comment } = req.body;

  if (!user || !postId || !comment) {
    throw new BadRequestError('invalid request');
  }

  const {
    firstName,
    lastName,
    isPremiumUser,
    profilePicture: { image },
    accountType,
  } = user;

  let newComment;

  if (req.user.accountType === 'AgroExpert') {
    newComment = await Comment.create({
      firstName,
      lastName,
      isPremiumUser,
      profilePicture: image,
      accountType,
      comment,
      postId,
      expert: req.user._id,
    });
  } else {
    newComment = await Comment.create({
      firstName,
      lastName,
      isPremiumUser,
      profilePicture: image,
      accountType,
      comment,
      postId,
      trader: req.user._id,
    });
  }
  const post = await Post.findById({ _id: postId });
  post.comments.push(newComment);
  await post.save();
  res.status(StatusCodes.CREATED).json(post);
};

const getPostComments = async (req, res) => {
  const { id } = req.params;
  const comments = await Comment.find({ postId: id });
  res.status(StatusCodes.OK).json(comments);
};

module.exports = {
  createComment,
  getPostComments,
};
