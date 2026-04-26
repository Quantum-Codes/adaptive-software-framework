"use strict";

function requireFeature(featureId) {
  return (req, res, next) => {
    if (!req.flipper || req.flipper.isActive(featureId)) {
      return next();
    }

    return res.status(403).json({
      errors: { body: ["Feature disabled"] },
      featureId,
    });
  };
}

module.exports = requireFeature;

