import { ALL_FEATURE_IDS, LOCKED_FEATURES } from "./featureRegistry";

export function buildDefaultAdaptiveSchema(userId = "guest") {
  const features = Object.fromEntries(
    ALL_FEATURE_IDS.map((featureId) => [featureId, true]),
  );

  return {
    schemaVersion: "1.0",
    userId: String(userId),
    lastEvaluated: new Date(0).toISOString(),
    lockedFeatures: [...LOCKED_FEATURES],
    features,
  };
}

export function sanitizeAdaptiveSchema(rawSchema, userId = "guest") {
  const fallback = buildDefaultAdaptiveSchema(userId);
  const rawFeatures = rawSchema?.features;

  if (!rawSchema || typeof rawSchema !== "object" || !rawFeatures) {
    return fallback;
  }

  const features = { ...fallback.features };
  for (const featureId of ALL_FEATURE_IDS) {
    if (typeof rawFeatures[featureId] === "boolean") {
      features[featureId] = rawFeatures[featureId];
    }
  }

  for (const featureId of LOCKED_FEATURES) {
    features[featureId] = true;
  }

  return {
    schemaVersion:
      typeof rawSchema.schemaVersion === "string"
        ? rawSchema.schemaVersion
        : fallback.schemaVersion,
    userId: String(rawSchema.userId ?? userId),
    lastEvaluated:
      typeof rawSchema.lastEvaluated === "string"
        ? rawSchema.lastEvaluated
        : fallback.lastEvaluated,
    lockedFeatures: [...new Set([...LOCKED_FEATURES, ...(rawSchema.lockedFeatures || [])])],
    features,
  };
}

