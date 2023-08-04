const Pool = require("../config/db");

const createUser = (data) => {
  const { id, email, name, phone, passwordHash } = data;
  return Pool.query(
    `INSERT INTO worker( worker_id, worker_name, worker_email, worker_phone, worker_password ) VALUES('${id}','${name}','${email}','${phone}','${passwordHash}')`
  );
};

const selectAllWorker = (limit, offset, sortby, sort) => {
  return Pool.query(
    `SELECT * FROM worker ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
};

const selectWorker = (id) => {
  return Pool.query(`SELECT * FROM worker WHERE worker_id='${id}'`);
};

const updateWorker = (data) => {
  const { id, name, province, city, workplace, description } = data;
  return Pool.query(
    `UPDATE worker SET worker_name='${name}', worker_province='${province}', worker_city='${city}', worker_workplace='${workplace}', worker_description='${description}' WHERE worker_id='${id}'`
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

const findId = (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT worker_id FROM worker WHERE worker_id='${id}'`,
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
