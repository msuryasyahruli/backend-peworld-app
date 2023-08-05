const {
  selectAllPortfolio,
  selectPortfolio,
  insertPortfolio,
  updatePortfolio,
  deletePortfolio,
  countData,
  findId,
} = require("../model/portfolio");
const { v4: uuidv4 } = require("uuid");
const commonHelper = require("../helper/common");

const portfolioController = {
  getAllPortfolio: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10000;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "create_at";
      const sort = req.query.sort || "ASC";
      const result = await selectAllPortfolio(limit, offset, sortby, sort);
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

  getDetailPortfolio: async (req, res) => {
    const portfolio_id = String(req.params.id);
    const { rowCount } = await findId(portfolio_id);
    if (!rowCount) {
      res.json({ message: "ID is Not Found" });
    }
    selectPortfolio(portfolio_id)
      .then((result) => {
        commonHelper.response(res, result.rows, 200, "get data success");
      })
      .catch((err) => res.send(err));
  },

  createPortfolio: async (req, res) => {
    const { link_repo, tipe, app_name, workerid } = req.body;
    const portfolio_id = uuidv4();
    const data = {
      portfolio_id,
      link_repo,
      tipe,
      app_name,
      workerid,
    };
    insertPortfolio(data)
      .then((result) =>
        commonHelper.response(res, result.rows, 201, "Portfolio created")
      )
      .catch((err) => res.send(err));
  },

  updatePortfolio: async (req, res) => {
    try {
      const portfolio_id = String(req.params.id);
      const { link_repo, tipe, app_name, workerid } = req.body;
      const { rowCount } = await findId(portfolio_id);
      if (!rowCount) {
        res.json({ message: "ID is Not Found" });
      }
      const data = {
        portfolio_id,
        link_repo,
        tipe,
        app_name,
        workerid,
      };
      updatePortfolio(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Portfolio updated")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  deletePortfolio: async (req, res) => {
    try {
      const portfolio_id = String(req.params.id);
      const { rowCount } = await findId(portfolio_id);
      if (!rowCount) {
        res.json({ message: "ID is Not Found" });
      }
      deletePortfolio(portfolio_id)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Portfolio deleted")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = portfolioController;
