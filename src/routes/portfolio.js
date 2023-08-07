const express = require("express");
const router = express.Router();
const portfolioController = require("../controller/portfolio");
const upload = require("../middleware/upload");

router
  .get("/", portfolioController.getAllPortfolio)
  .get("/:id", portfolioController.getDetailPortfolio)
  .post("/", upload, portfolioController.createPortfolio)
  .put("/:id", upload, portfolioController.updatePortfolio)
  .delete("/:id", portfolioController.deletePortfolio);

module.exports = router;
