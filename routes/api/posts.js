const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const isValidMongoId = require("../../helpers/validateOnMongoIdParam");
const {
  validateOnCreatePost,
  getPostById,
  createPost,
  LikePost,
  deleteCommentFromPost,
  deletePostById,
  unLikePost,
  commentOnPost,
  getAllPosts,
} = require("./../../controllers/post");

router.use(auth);
router.post("/", [validateOnCreatePost()], createPost);
router.get("/", getAllPosts);
router.get("/:id", [isValidMongoId()], getPostById);
router.delete("/:id", [isValidMongoId()], deletePostById);
router.put("/like/:id", [isValidMongoId()], LikePost);
router.put("/unlike/:id", [isValidMongoId()], unLikePost);
router.post("/comment/:id", [validateOnCreatePost()], commentOnPost);
router.delete(
  "/comment/:id/:comment_id",
  [isValidMongoId()],
  deleteCommentFromPost
);
module.exports = router;
