const { StatusCodes } = require('http-status-codes');
const Post = require('../../models/postsModel');
const Comment = require('../../models/commentModel');
const ObjectId = require('mongodb').ObjectId;

const BadRequestError = require('../../errors/badRequestError');
const { sendCommentNotificationEmail } = require('../../utils/sendEmail');
const commentNotificationEmailTemplate = require('../../utils/commentNotificationHmtl');

// this is for creating a new post
const createComment = async (req, res) => {
  const { user, postID, comment } = req.body;
  // extract the required values from the req.body for security purpose
  // this is to get the origin of the host
  const origin = req.headers.origin;

  // check if the user provides all the required values before they can start commenting
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

  // replace the white spaces on the name with an underscore so directing the user to the post link will work.
  const name = fullName.replace(/\s/g, '_');

  // this is the html that is to be sent to the post author notifying them that a user has commented on their post
  // const html = commentNotificationEmailTemplate(
  //   fullName,
  //   name,
  //   origin,
  //   postID,
  //   comment
  // );

  // find the post their about to comment on so you attach it to the comment
  const post = await Post.findById({ _id: postID });
  console.log(post);

  const link = `${origin}/post/${name}/${postID}`;

  // create the comment by including the user that created the comment check if it was an agro expert that created the comment.
  const postAuthorId = new ObjectId(req.user._id);
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

    // compare the post author against the user who is about to create a new comment
    if (!postAuthorId.equals(post.expert)) {
      // sent an email notification to the post author if it is not the post author that commented on the post
      // await sendEmail(post.authorEmail, `${fullName} (via Agric zone)`, html);
      await sendCommentNotificationEmail(
        post.authorEmail,
        fullName,
        comment,
        link
      );
    }
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
    // same this if it is an agro trader that made the comment
    if (!postAuthorId.equals(post.trader)) {
      // await sendEmail(post.authorEmail, `${fullName} (via Agric zone)`, html);
      await sendCommentNotificationEmail(
        post.authorEmail,
        fullName,
        comment,
        link
      );
    }
  }

  // add the comment to the previous comments that has been made on the post already
  post.comments.push(newComment);
  // save the new post array
  await post.save();
  // send back th
  res.status(StatusCodes.CREATED).json('comment created');
};

// get all the post attached to a particular comment
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
