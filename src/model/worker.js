const Pool = require("../config/db");

const createUser = (data) => {
  const {
    worker_id,
    worker_name,
    worker_email,
    worker_phone,
    passwordHash,
    role,
  } = data;
  return Pool.query(
    `INSERT INTO worker( worker_id, worker_name, worker_email, worker_phone, worker_password, worker_role ) VALUES('${worker_id}','${worker_name}','${worker_email}','${worker_phone}','${passwordHash}','${role}')`
  );
};

const selectAllWorker = (sortby, sort) => {
  return Pool.query(
    `SELECT * FROM worker ORDER BY ${sortby} ${sort}`
  );
};

const selectWorker = (worker_id) => {
  return Pool.query(`SELECT * FROM worker WHERE worker_id='${worker_id}'`);
};

const updateWorker = (data) => {
  const {
    worker_id,
    worker_name,
    worker_province,
    worker_city,
    worker_workplace,
    worker_description,
    worker_jobdesk,
  } = data;
  return Pool.query(
    `UPDATE worker SET worker_name='${worker_name}', worker_province='${worker_province}', worker_city='${worker_city}', worker_workplace='${worker_workplace}', worker_description='${worker_description}', worker_jobdesk='${worker_jobdesk}' WHERE worker_id='${worker_id}'`
  );
};

const findEmail = (email) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM worker WHERE worker_email='${email}'`,
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

const findId = (worker_id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT worker_id FROM worker WHERE worker_id='${worker_id}'`,
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
  return Pool.query("SELECT COUNT(*) FROM worker");
};

module.exports = {
  createUser,
  updateWorker,
  selectWorker,
  selectAllWorker,
  findEmail,
  findId,
  countData,
};
