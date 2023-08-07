const Pool = require("../config/db");

const selectAllPortfolio = (limit, offset, sortby, sort) => {
  return Pool.query(
    `SELECT * FROM portfolio ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
};

const selectPortfolio = (workerid) => {
  return Pool.query(`SELECT * FROM portfolio WHERE workerid='${workerid}'`);
};

const insertPortfolio = (data) => {
  const { portfolio_id, link_repo, tipe, app_name, photo, workerid } = data;
  return Pool.query(
    `INSERT INTO Portfolio(portfolio_id, link_repo, tipe, app_name, photo, workerid) VALUES('${portfolio_id}','${link_repo}','${tipe}','${app_name}','${photo}','${workerid}')`
  );
};

const updatePortfolio = (data) => {
  const { portfolio_id, link_repo, tipe, app_name } = data;
  return Pool.query(
    `UPDATE Portfolio SET link_repo='${link_repo}', tipe='${tipe}', app_name='${app_name}' WHERE portfolio_id='${portfolio_id}'`
  );
};

const deletePortfolio = (portfolio_id) => {
  return Pool.query(`DELETE FROM portfolio WHERE portfolio_id='${portfolio_id}'`);
};

const countData = () => {
  return Pool.query("SELECT COUNT(*) FROM portfolio");
};

const findId = (portfolio_id) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT portfolio_id FROM portfolio WHERE portfolio_id='${portfolio_id}'`, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    })
  );
};

module.exports = {
  selectAllPortfolio,
  selectPortfolio,
  insertPortfolio,
  updatePortfolio,
  deletePortfolio,
  countData,
  findId,
};
