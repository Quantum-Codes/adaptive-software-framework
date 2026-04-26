"use strict";

const LOCKED_FEATURES = [
  "ID_NAV_TOPBAR",
  "ID_AUTH_LOGIN",
  "ID_AUTH_REGISTER",
  "ID_AUTH_LOGOUT",
  "ID_APP_SETTINGS",
  "ID_RESTORE_HIDDEN_FEATURES",
  "ID_ERROR_BOUNDARY",
];

const ADAPTIVE_FEATURES = {
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

const ALL_FEATURE_IDS = [...LOCKED_FEATURES, ...Object.keys(ADAPTIVE_FEATURES)];

const FEATURE_THRESHOLDS = Object.fromEntries(
  Object.entries(ADAPTIVE_FEATURES).map(([featureId, meta]) => [
    featureId,
    meta.threshold ?? 3,
  ]),
);

module.exports = {
  ADAPTIVE_FEATURES,
  ALL_FEATURE_IDS,
  FEATURE_THRESHOLDS,
  LOCKED_FEATURES,
};

