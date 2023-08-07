const express = require("express");
const router = express.Router();
const skill = require("../controller/skill");

router
  .get("/", skill.getAllSkill)
  .get("/:id", skill.getDetailSkill)
  .post("/", skill.createSkill)
  .delete("/:skill_id", skill.deleteSkill);

module.exports = router;
