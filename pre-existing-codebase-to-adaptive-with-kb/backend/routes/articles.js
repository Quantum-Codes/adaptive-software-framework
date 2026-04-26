const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authentication");
const adaptiveContext = require("../middleware/adaptiveContext");
const requireFeature = require("../middleware/requireFeature");
const {
  allArticles,
  createArticle,
  singleArticle,
  updateArticle,
  deleteArticle,
  articlesFeed,
} = require("../controllers/articles");

//? All Articles - by Author/by Tag/Favorited by user
router.get("/", verifyToken, adaptiveContext, allArticles);
//* Create Article
router.post("/", verifyToken, adaptiveContext, createArticle);
//* Feed
router.get(
  "/feed",
  verifyToken,
  adaptiveContext,
  requireFeature("ID_FEED_PERSONAL"),
  articlesFeed,
);
// Single Article by slug
router.get("/:slug", verifyToken, adaptiveContext, singleArticle);
//* Update Article
router.put("/:slug", verifyToken, adaptiveContext, updateArticle);
//* Delete Article
router.delete("/:slug", verifyToken, adaptiveContext, deleteArticle);

const favoritesRoutes = require("./articles/favorites");
const commentsRoutes = require("./articles/comments");

//> Favorites routes
router.use("/", favoritesRoutes);
//> Comments routes
router.use("/", commentsRoutes);

module.exports = router;
