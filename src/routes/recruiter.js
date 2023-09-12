const express = require("express");
const recruiterController = require("../controller/recruiter");
const router = express.Router();
const { protect } = require("../middleware/auth");

router
  .post("/register", recruiterController.registerUser)
  .post("/login", recruiterController.loginUser)
  .get("/verify",recruiterController.VerifyAccount)
  .get("/profile", protect, recruiterController.profile)
  .put("/:id", recruiterController.updateRecruiter)
  .get("/:id", recruiterController.getDetailRecruiter)
  .post("/refreshToken", recruiterController.refreshToken);


module.exports = router;