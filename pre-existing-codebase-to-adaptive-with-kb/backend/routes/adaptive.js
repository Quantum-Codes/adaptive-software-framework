"use strict";

const express = require("express");
const verifyToken = require("../middleware/authentication");
const adaptiveContext = require("../middleware/adaptiveContext");
const { trackFeatureUsage } = require("../controllers/adaptive");

const router = express.Router();

router.post("/track", verifyToken, adaptiveContext, trackFeatureUsage);

module.exports = router;

