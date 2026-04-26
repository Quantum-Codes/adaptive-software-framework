"use strict";

const FlipperEngine = require("../adaptive/flipperEngine");
const { sanitizeSchema } = require("../adaptive/metadataSchema");

function adaptiveContext(req, _res, next) {
  const userId = req.loggedUser?.id ?? "guest";
  const schema = sanitizeSchema(req.loggedUser?.adaptiveSchema, userId);

  const flipper = new FlipperEngine();
  flipper.init(schema);

  req.adaptiveSchema = schema;
  req.flipper = flipper;

  next();
}

module.exports = adaptiveContext;

