"use strict";

const {
  ADAPTIVE_FEATURES,
  ALL_FEATURE_IDS,
  LOCKED_FEATURES,
} = require("./featureRegistry");

function getDefaultFeatureState() {
  return Object.fromEntries(ALL_FEATURE_IDS.map((featureId) => [featureId, true]));
}

function buildDefaultSchema(userId) {
  return {
    schemaVersion: "1.0",
    userId: String(userId ?? "guest"),
    lastEvaluated: new Date(0).toISOString(),
    lockedFeatures: [...LOCKED_FEATURES],
    features: getDefaultFeatureState(),
  };
}

function sanitizeSchema(rawSchema, userId) {
  const fallback = buildDefaultSchema(userId);

  if (!rawSchema || typeof rawSchema !== "object") {
    return fallback;
  }

  const rawFeatures = rawSchema.features;
  if (!rawFeatures || typeof rawFeatures !== "object") {
    return fallback;
  }

  const features = getDefaultFeatureState();

  for (const featureId of ALL_FEATURE_IDS) {
    if (typeof rawFeatures[featureId] === "boolean") {
      features[featureId] = rawFeatures[featureId];
    }
  }

  for (const featureId of LOCKED_FEATURES) {
    features[featureId] = true;
  }

  const lockedFeatures = Array.isArray(rawSchema.lockedFeatures)
    ? rawSchema.lockedFeatures.filter((featureId) => LOCKED_FEATURES.includes(featureId))
    : [];

  return {
    schemaVersion: typeof rawSchema.schemaVersion === "string" ? rawSchema.schemaVersion : "1.0",
    userId: String(rawSchema.userId ?? userId ?? "guest"),
    lastEvaluated:
      typeof rawSchema.lastEvaluated === "string"
        ? rawSchema.lastEvaluated
        : fallback.lastEvaluated,
    lockedFeatures: [...new Set([...LOCKED_FEATURES, ...lockedFeatures])],
    features,
  };
}

function getAdaptiveFeatureIds() {
  return Object.keys(ADAPTIVE_FEATURES);
}

module.exports = {
  buildDefaultSchema,
  getAdaptiveFeatureIds,
  sanitizeSchema,
};

