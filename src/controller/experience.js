const {
  selectAllExp,
  insertExp,
  updateExp,
  deleteExp,
  countData,
  findId,
} = require("../model/experience");
const { v4: uuidv4 } = require("uuid");
const commonHelper = require("../helper/common");

const expController = {
  getAllExp: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 1000;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "create_at";
      const sort = req.query.sort || "ASC";
      const result = await selectAllExp(limit, offset, sortby, sort);
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

  createExp: async (req, res) => {
    const {
      position,
      company_name,
      working_start,
      working_end,
      description,
      workerid,
    } = req.body;
    const exp_id = uuidv4();
    const data = {
      exp_id,
      position,
      company_name,
      working_start,
      working_end,
      description,
      workerid,
    };
    // console.log(data);
    insertExp(data)
      .then((result) =>
        commonHelper.response(res, result.rows, 201, "Exp created")
      )
      .catch((err) => res.send(err));
  },

  updateExp: async (req, res) => {
    try {
      const PORT = process.env.PORT || 2525;
      const DB_HOST = process.env.PGHOST || "localhost";
      const exp_id = String(req.params.id);
      const {
        position,
        company_name,
        working_start,
        working_end,
        description,
      } = req.body;
      const { rowCount } = await findId(exp_id);
      if (!rowCount) {
        res.json({ message: "ID is Not Found" });
      }
      const data = {
        exp_id,
        position,
        company_name,
        working_start,
        working_end,
        description,
      };
      updateExp(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Exp updated")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  deleteExp: async (req, res) => {
    try {
      const exp_id = String(req.params.id);
      const { rowCount } = await findId(exp_id);
      if (!rowCount) {
        res.json({ message: "ID is Not Found" });
      }
      deleteExp(exp_id)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Exp deleted")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = expController;
