const express = require("express");
const router = express.Router();
const expController = require("../controller/experience");
// const upload = require("../middleware/upload");

router
  .get("/", expController.getAllExp)
  .post("/", expController.createExp)
  .put("/:id", expController.updateExp)
  .delete("/:id", expController.deleteExp);

module.exports = router;
