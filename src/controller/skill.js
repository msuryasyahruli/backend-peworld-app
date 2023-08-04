const {
  selectAllSkill,
  insertSkill,
  deleteSkill,
  countData,
  findId,
} = require("../model/skill");
const { v4: uuidv4 } = require("uuid");
const commonHelper = require("../helper/common");

const skillController = {
  getAllSkill: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10000;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "skill_id";
      const sort = req.query.sort || "ASC";
      const result = await selectAllSkill(limit, offset, sortby, sort);
      const {
        rows: [count],
      } = await countData();
      const totalData = parseInt(count.count);
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        currentPage: page,
        limit: limit,
        totalData: totalData,
        totalPage: totalPage,
      };
      commonHelper.response(
        res,
        result.rows,
        200,
        "get data success",
        pagination
      );
    } catch (error) {
      console.log(error);
    }
  },

  createSkill: async (req, res) => {
    const { skill_name, workerid } = req.body;
    const skill_id = uuidv4();
    const data = {
      skill_id,
      skill_name,
      workerid,
    };
    insertSkill(data)
      .then((result) => {
        commonHelper.response(res, result.rows, 201, "Skill created");
      })
      .catch((err) => res.send(err));
  },

  deleteSkill: async (req, res) => {
    try {
      const skill_id = String(req.params.skill_id);
      const { rowCount } = await findId(skill_id);
      if (!rowCount) {
        res.json({ message: "ID is Not Found" });
      }
      deleteSkill(skill_id)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Skill deleted")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = skillController;
