const { body } = require("express-validator");
const User = require("../models/User");
const Post = require("../models/Post");

const { checkValidations } = require("../helpers/checkMethods");
const createHttpError = require("http-errors");

const validateOnCreatePost = () => {
  return [
    body("text")
      .exists()
      .withMessage("text is required")
      .bail()
      .notEmpty()
      .withMessage("text can't be empty")
      .bail(),
  ];
};

const createPost = async (req, res, next) => {
  try {
    const body = checkValidations(req);
    const user = await User.findById(req.user.id).select("name");

    const newPost = new Post({
      text: body.text,
      name: user.name,
      user: req.user.id,
    });

    const post = await newPost.save();

    res.json(post);
  } catch (err) {
    next(err);
  }
};

const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const body = checkValidations(req);
    const post = await Post.findById(req.params.id);

    if (!post) {
      throw createHttpError(404, "post not found");
    }
    res.json(post);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const deletePostById = async (req, res, next) => {
  try {
    const body = checkValidations(req);
    const post = await Post.findById(req.params.id);

    if (!post) {
      throw createHttpError(404, "post not found");
    }

    // Check user
    if (post.user.toString() !== req.user.id) {
      throw createHttpError(401, "User not authorized");
    }

    await post.remove();

    res.json({ message: "Post removed" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const LikePost = async (req, res, next) => {
  try {
    const body = checkValidations(req);
    const post = await Post.findById(req.params.id);

    if (!post) {
      throw createHttpError(404, "post not found");
    }
    // Check if the post has already been liked
    if (post.likes.some((like) => like.user.toString() === req.user.id)) {
      throw createHttpError(400, "Post already liked");
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    return res.json(post.likes);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const unLikePost = async (req, res, next) => {
  try {
    const body = checkValidations(req);
    const post = await Post.findById(req.params.id);

    if (!post) {
      throw createHttpError(404, "post not found");
    }
    if (!post.likes.some((like) => like.user.toString() === req.user.id)) {
      throw createHttpError(400, "Post has not yet been liked");
    }

    post.likes = post.likes.filter(
      ({ user }) => user.toString() !== req.user.id
    );

    await post.save();

    return res.json(post.likes);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const commentOnPost = async (req, res, next) => {
  try {
    const body = checkValidations(req);
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      throw createHttpError(404, "user not found");
    }
    const post = await Post.findById(req.params.id);

    if (!post) {
      throw createHttpError(404, "post not found");
    }
    const newComment = {
      text: body.text,
      name: user.name,
      user: req.user.id,
    };

    post.comments.unshift(newComment);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const deleteCommentFromPost = async (req, res, next) => {
  try {
    const body = checkValidations(req);
    const post = await Post.findById(req.params.id);

    if (!post) {
      throw createHttpError(404, "post not found");
    }

    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    if (!comment) {
      throw createHttpError(404, "Comment does not exist");
    }

    if (comment.user.toString() !== req.user.id) {
      throw createHttpError(401, "User not authorized");
    }

    post.comments = post.comments.filter(
      ({ id }) => id !== req.params.comment_id
    );

    await post.save();

    return res.json(post.comments);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = {
  LikePost,
  unLikePost,
  createPost,
  deletePostById,
  deleteCommentFromPost,
  commentOnPost,
  getPostById,
  getAllPosts,
  validateOnCreatePost,
};
