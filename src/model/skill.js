const Pool = require("../config/db");

const selectAllSkill = (limit, offset, sortby, sort) => {
  return Pool.query(
    `SELECT * FROM skill ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
};

const insertSkill = (data) => {
  const { skill_id, skill_name, workerid } = data;
  return Pool.query(`INSERT INTO skill(skill_id,skill_name,workerid) VALUES('${skill_id}','${skill_name}','${workerid}')`);
};

const deleteSkill = (skill_id) => {
  return Pool.query(`DELETE FROM skill WHERE skill_id='${skill_id}'`);
};

const countData = () => {
  return Pool.query("SELECT COUNT(*) FROM skill");
};

const findId = (skill_id) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT skill_id FROM skill WHERE skill_id='${skill_id}'`, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    })
  );
};


module.exports = {
  selectAllSkill,
  insertSkill,
  deleteSkill,
  countData,
  findId,
};
