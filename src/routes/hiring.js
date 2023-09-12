const express = require("express");
const router = express.Router();
const hireController = require("../controller/hiring");
router
  .post("/", hireController.createHire)
  .get("/", hireController.getAllHire)
  .get("/worker/:id", hireController.getSelectHireWorker)
  .get("/recruiter/:id", hireController.getSelectHireRecruiter)
  .delete("/:id", hireController.deleteHire);
module.exports = router;