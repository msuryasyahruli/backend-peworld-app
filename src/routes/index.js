const express = require("express");
const router = express.Router();
const expRouter = require("../routes/experience");
const skillRouter = require("../routes/skill");
const portfolioRouter = require("../routes/portfolio");
const usersRouter = require("../routes/worker");

router.use("/exp", expRouter);
router.use("/skill", skillRouter);
router.use("/portfolio", portfolioRouter);
router.use("/worker", usersRouter);

module.exports = router;
