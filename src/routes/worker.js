const express = require("express");
const router = express.Router();
const workerController = require("../controller/worker");
const { protect } = require("../middleware/auth");

router
  .post("/register", workerController.registerUser)
  .post("/login", workerController.loginUser)
  .put("/:id", workerController.updateWorker)
  .get("/profile", workerController.profile)
  .get("/:id", workerController.getDetailWorker)
  .get("/", workerController.getAllWorker)
  .post("/refreshToken", workerController.refreshToken);

module.exports = router;
