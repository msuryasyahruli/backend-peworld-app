const { v4: uuidv4 } = require("uuid");
const commonHelper = require("../helper/common");
let {
  selectAllHire,
  selectHireWorker,
  selectHireRecruiter,
  deleteHire,
  createHire,
  findUUID,
  countData,
} = require("../model/hiring");
const sendemailoffer = require("../middleware/sendemailoffer");

let hireController = {
  getAllHire: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "hiring_id";
      const sort = req.query.sort || "ASC";
      let result = await selectAllHire({ limit, offset, sort, sortby });
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
        "Get Hire Data Success",
        pagination
      );
    } catch (err) {
      console.log(err);
    }
  },

  getSelectHireWorker: async (req, res) => {
    const worker_id = String(req.params.id);
    selectHireWorker(worker_id)
      .then((result) => {
        commonHelper.response(res, result.rows, 200, "Get Hire Detail Success");
      })
      .catch((err) => res.send(err));
  },

  getSelectHireRecruiter: async (req, res) => {
    const recruiter_id = String(req.params.id);
    selectHireRecruiter(recruiter_id)
      .then((result) => {
        commonHelper.response(res, result.rows, 200, "Get Hire Detail Success");
      })
      .catch((err) => res.send(err));
  },

  createHire: async (req, res) => {
    const {
      hiring_title,
      hiring_message,
      worker_id,
      recruiter_id,
      worker_name,
      worker_email,
      company_name,
    } = req.body;
    const hiring_id = uuidv4();
    const data = {
      hiring_id,
      hiring_title,
      hiring_message,
      worker_name,
      worker_id,
      worker_email,
      recruiter_id,
      company_name,
    };

    await sendemailoffer(
      company_name,
      worker_email,
      worker_name,
      hiring_title,
      hiring_message,
      `Job Offer: ${hiring_title} at ${company_name}`
    );

    createHire(data)
      .then((result) =>
        commonHelper.response(res, result.rows, 201, "Create Hire Success")
      )
      .catch((err) => res.send(err));
  },

  deleteHire: async (req, res) => {
    try {
      const hiring_id = String(req.params.id);
      const { rowCount } = await findUUID(hiring_id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      deleteHire(hiring_id)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Delete Hire Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = hireController;
