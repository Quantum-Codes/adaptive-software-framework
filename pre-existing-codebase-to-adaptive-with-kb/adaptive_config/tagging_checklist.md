[ ] frontend/src/components/Navbar/Navbar.jsx -> Add Feature ID gates for `ID_NAV_TOPBAR`, `ID_AUTH_LOGIN`, `ID_AUTH_REGISTER`
[ ] frontend/src/components/Navbar/DropdownMenu.jsx -> Add Feature ID gates for `ID_APP_SETTINGS`, `ID_AUTH_LOGOUT`
[ ] frontend/src/components/HiddenFeaturesManager/HiddenFeaturesManager.jsx -> Add restore UI for `ID_RESTORE_HIDDEN_FEATURES`
[ ] frontend/src/routes/Home.jsx -> Add gate for `ID_DISCOVERY_POPULAR_TAGS`
[ ] frontend/src/components/PopularTags/PopularTags.jsx -> Add `data-feature-id="ID_DISCOVERY_POPULAR_TAGS"`
[ ] frontend/src/components/PopularTags/TagButton.jsx -> Add click tracking tag for `ID_DISCOVERY_POPULAR_TAGS`
[ ] frontend/src/components/FeedToggler/FeedToggler.jsx -> Gate `ID_FEED_PERSONAL`
[ ] frontend/src/context/FeedContext.jsx -> Default to global feed when `ID_FEED_PERSONAL` is disabled
[ ] frontend/src/routes/Profile/Profile.jsx -> Gate `ID_PROFILE_FAVORITED_ARTICLES` tab
[ ] frontend/src/routes/Profile/ProfileFavArticles.jsx -> Prevent favorites requests when `ID_PROFILE_FAVORITED_ARTICLES` is disabled
[ ] frontend/src/routes/Article/Article.jsx -> Gate comments mount for `ID_ARTICLE_COMMENTS`
[ ] frontend/src/components/CommentEditor/CommentEditor.jsx -> Add `data-feature-id="ID_ARTICLE_COMMENTS"`
[ ] frontend/src/components/CommentList/CommentList.jsx -> Add `data-feature-id="ID_ARTICLE_COMMENTS"`
[ ] backend/routes/articles.js -> Add route guard for `ID_FEED_PERSONAL`
[ ] backend/controllers/articles.js -> Add controller guard for `ID_PROFILE_FAVORITED_ARTICLES`
[ ] backend/routes/articles/comments.js -> Add middleware guard for `ID_ARTICLE_COMMENTS`
[ ] backend/controllers/adaptive.js -> Add tracking ingestion endpoint and batching support
[ ] backend/adaptive/adaptationService.js -> Add rolling-window evaluator and schema mutation
