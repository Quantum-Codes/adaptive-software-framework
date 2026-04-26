"use strict";

const { FeatureUsageStat } = require("../models");
const { ALL_FEATURE_IDS } = require("../adaptive/featureRegistry");
const { toDateBucket } = require("../adaptive/adaptationService");

function normalizeEvents(events) {
  if (!Array.isArray(events)) return [];

  const allowedIds = new Set(ALL_FEATURE_IDS);

  return events
    .filter((event) => event && typeof event === "object")
    .map((event) => ({
      f_id: String(event.f_id ?? ""),
      ts: Number(event.ts),
    }))
    .filter((event) => allowedIds.has(event.f_id) && Number.isFinite(event.ts));
}

async function trackFeatureUsage(req, res, next) {
  try {
    const { loggedUser } = req;
    if (!loggedUser) {
      return res.status(202).json({ accepted: true, queued: 0 });
    }

    const events = normalizeEvents(req.body?.events);
    if (events.length === 0) {
      return res.status(202).json({ accepted: true, queued: 0 });
    }

    const bucketedCounts = {};
    for (const event of events) {
      const bucket = toDateBucket(new Date(event.ts));
      const key = `${event.f_id}:${bucket}`;
      bucketedCounts[key] = (bucketedCounts[key] || 0) + 1;
    }

    const operations = Object.entries(bucketedCounts).map(async ([key, count]) => {
      const [featureId, timeBucket] = key.split(":");
      const [row] = await FeatureUsageStat.findOrCreate({
        defaults: { usageCount: 0 },
        where: { featureId, timeBucket, userId: loggedUser.id },
      });
      await row.increment("usageCount", { by: count });
    });

    await Promise.all(operations);

    return res.status(202).json({ accepted: true, queued: events.length });
  } catch (error) {
    return next(error);
  }
}

module.exports = { trackFeatureUsage };
