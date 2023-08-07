const Pool = require("../config/db");

const selectAllExp = (limit, offset, sortby, sort) => {
  return Pool.query(
    `SELECT * FROM exp ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
};

const insertExp = (data) => {
  const {
    exp_id,
    position,
    company_name,
    working_start,
    working_end,
    description,
    workerid,
  } = data;
  return Pool.query(
    `INSERT INTO exp(exp_id,position,company_name,working_start,working_end,description,workerid)VALUES ('${exp_id}','${position}','${company_name}','${working_start}','${working_end}','${description}','${workerid}')`
  );
};

const updateExp = (data) => {
  const {exp_id,position,company_name,working_start,working_end,description} = data;
  return Pool.query(
    `UPDATE exp SET position='${position}', company_name='${company_name}', working_start='${working_start}', working_end='${working_end}', description='${description}' WHERE exp_id='${exp_id}'`
  );
};

const deleteExp = (exp_id) => {
  return Pool.query(`DELETE FROM exp WHERE exp_id='${exp_id}'`);
};

const countData = () => {
  return Pool.query("SELECT COUNT(*) FROM exp");
};

const findId = (exp_id) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT exp_id FROM exp WHERE exp_id='${exp_id}'`, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    })
  );
};

module.exports = {
  selectAllExp,
  insertExp,
  updateExp,
  deleteExp,
  countData,
  findId,
};
