export const LOCKED_FEATURES = [
  "ID_NAV_TOPBAR",
  "ID_AUTH_LOGIN",
  "ID_AUTH_REGISTER",
  "ID_AUTH_LOGOUT",
  "ID_APP_SETTINGS",
  "ID_RESTORE_HIDDEN_FEATURES",
  "ID_ERROR_BOUNDARY",
];

export const ADAPTIVE_FEATURES = {
  ID_DISCOVERY_POPULAR_TAGS: {
    displayName: "Popular Tags Sidebar",
    threshold: 3,
  },
  ID_FEED_PERSONAL: {
    displayName: "Personal Feed",
    threshold: 3,
  },
  ID_PROFILE_FAVORITED_ARTICLES: {
    displayName: "Favorited Articles Tab",
    threshold: 2,
  },
  ID_ARTICLE_COMMENTS: {
    displayName: "Article Comments",
    threshold: 3,
  },
};

export const ALL_FEATURE_IDS = [
  ...LOCKED_FEATURES,
  ...Object.keys(ADAPTIVE_FEATURES),
];

