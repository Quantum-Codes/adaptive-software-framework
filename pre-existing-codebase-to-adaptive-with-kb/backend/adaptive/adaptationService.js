"use strict";

const { Op, fn, col } = require("sequelize");
const { FEATURE_THRESHOLDS, LOCKED_FEATURES } = require("./featureRegistry");
const { sanitizeSchema, getAdaptiveFeatureIds } = require("./metadataSchema");
const { FeatureUsageStat, User } = require("../models");

const ADAPTATION_EVALUATION_WINDOW_DAYS = 14;
const ADAPTATION_RERUN_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;

function toDateBucket(date = new Date()) {
  return date.toISOString().split("T")[0];
}

async function runAdaptationCycleForUser(user) {
  if (!user) return false;

  const schema = sanitizeSchema(user.adaptiveSchema, user.id);
  const cutoff = new Date(Date.now() - ADAPTATION_EVALUATION_WINDOW_DAYS * 24 * 60 * 60 * 1000);
  const cutoffDateBucket = toDateBucket(cutoff);

  const usageRows = await FeatureUsageStat.findAll({
    attributes: ["featureId", [fn("SUM", col("usageCount")), "totalUsage"]],
    where: {
      userId: user.id,
      timeBucket: { [Op.gte]: cutoffDateBucket },
    },
    group: ["featureId"],
    raw: true,
  });

  const usageMap = Object.fromEntries(
    usageRows.map((row) => [row.featureId, Number(row.totalUsage) || 0]),
  );

  for (const featureId of getAdaptiveFeatureIds()) {
    if (LOCKED_FEATURES.includes(featureId)) continue;
    const threshold = FEATURE_THRESHOLDS[featureId] ?? 3;
    schema.features[featureId] = (usageMap[featureId] ?? 0) >= threshold;
  }

  schema.lastEvaluated = new Date().toISOString();
  user.adaptiveSchema = schema;
  await user.save({ fields: ["adaptiveSchema"] });

  return true;
}

async function runAdaptationCycleIfDue(user) {
  if (!user) return false;

  const schema = sanitizeSchema(user.adaptiveSchema, user.id);
  const lastEvaluatedTime = Date.parse(schema.lastEvaluated);

  if (
    Number.isFinite(lastEvaluatedTime) &&
    Date.now() - lastEvaluatedTime < ADAPTATION_RERUN_INTERVAL_MS
  ) {
    return false;
  }

  return runAdaptationCycleForUser(user);
}

async function runAdaptationCycleForUserId(userId) {
  const user = await User.findByPk(userId);
  return runAdaptationCycleForUser(user);
}

module.exports = {
  ADAPTATION_EVALUATION_WINDOW_DAYS,
  runAdaptationCycleForUserId,
  runAdaptationCycleIfDue,
  toDateBucket,
};

