const express = require("express");
const router = express.Router();
const portfolioController = require("../controller/portfolio");

router
  .get("/", portfolioController.getAllPortfolio)
  .get("/:id", portfolioController.getDetailPortfolio)
  .post("/", portfolioController.createPortfolio)
  .put("/:id", portfolioController.updatePortfolio)
  .delete("/:id", portfolioController.deletePortfolio);

module.exports = router;
