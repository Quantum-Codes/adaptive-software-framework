"use strict";

class FlipperEngine {
  constructor() {
    this.flags = {};
    this.initialized = false;
  }

  init(schema) {
    this.flags = schema?.features ?? {};
    this.initialized = true;
  }

  isActive(featureId) {
    if (!this.initialized) return true;
    if (this.flags[featureId] === undefined) return true;

    return this.flags[featureId];
  }

  getAllFlags() {
    return Object.freeze({ ...this.flags });
  }

  overrideFlag(featureId, state) {
    if (typeof state !== "boolean") return;
    this.flags[featureId] = state;
  }
}

module.exports = FlipperEngine;

