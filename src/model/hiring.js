const Pool = require("../config/db");

const selectAllHire = ({ limit, offset, sort, sortby }) => {
  return Pool.query(
    `SELECT * FROM hiring ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
};

const selectHireWorker = (worker_id) => {
  return Pool.query(`SELECT * FROM hiring WHERE worker_id = '${worker_id}'`);
};

const selectHireRecruiter = (recruiter_id) => {
  return Pool.query(
    `SELECT * FROM hiring WHERE recruiter_id = '${recruiter_id}'`
  );
};

const deleteHire = (hiring_id) => {
  return Pool.query(`DELETE FROM hiring WHERE hiring_id  = '${hiring_id}'`);
};

const createHire = (data) => {
  const {
    hiring_id,
    hiring_title,
    hiring_message,
    worker_id,
    worker_name,
    worker_email,
    recruiter_id,
    company_name,
  } = data;
  return Pool.query(`INSERT INTO hiring(hiring_id, hiring_title, hiring_message, worker_id, recruiter_id, worker_name, worker_email, company_name)  
    VALUES ('${hiring_id}','${hiring_title}','${hiring_message}','${worker_id}','${recruiter_id}','${worker_name}','${worker_email}','${company_name}')`);
};

const findUUID = (hiring_id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM hiring WHERE hiring_id= '${hiring_id}' `,
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    )
  );
};

const countData = () => {
  return Pool.query(`SELECT COUNT(*) FROM hiring`);
};

module.exports = {
  selectAllHire,
  selectHireWorker,
  selectHireRecruiter,
  deleteHire,
  createHire,
  findUUID,
  countData,
};
