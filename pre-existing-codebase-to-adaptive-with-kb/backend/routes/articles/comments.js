const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/authentication");
const adaptiveContext = require("../../middleware/adaptiveContext");
const requireFeature = require("../../middleware/requireFeature");
const {
  allComments,
  createComment,
  deleteComment,
} = require("../../controllers/comments");

//? All Comments for Article
router.get(
  "/:slug/comments",
  verifyToken,
  adaptiveContext,
  requireFeature("ID_ARTICLE_COMMENTS"),
  allComments,
);
//* Create Comment for Article
router.post(
  "/:slug/comments",
  verifyToken,
  adaptiveContext,
  requireFeature("ID_ARTICLE_COMMENTS"),
  createComment,
);
//* Delete Comment for Article
router.delete(
  "/:slug/comments/:commentId",
  verifyToken,
  adaptiveContext,
  requireFeature("ID_ARTICLE_COMMENTS"),
  deleteComment,
);

module.exports = router;
