const Pool = require("../config/db");

const createWorker = (data) => {
  const {
    worker_id,
    worker_name,
    worker_email,
    worker_phone,
    passwordHash,
    // role,
    verify,
  } = data;
  const role = "worker";
  return Pool.query(
    `INSERT INTO worker( worker_id, worker_name, worker_email, worker_phone, worker_password, worker_role, verify ) VALUES ('${worker_id}','${worker_name}','${worker_email}','${worker_phone}','${passwordHash}','${role}','${verify}')`
  );
};

const createUser = (
  worker_id,
  worker_name,
  worker_email,
  worker_phone,
  passwordHash,
  // role,
  verify
) => {
  const role = "worker";
  return Pool.query(
    `INSERT INTO worker( worker_id, worker_name, worker_email, worker_phone, worker_password, worker_role, verify ) VALUES ('${worker_id}','${worker_name}','${worker_email}','${worker_phone}','${passwordHash}','${role}','${verify}')`
  );
};

const createWorkerVerification = (worker_verification_id, worker_id, token) => {
  return Pool.query(
    `INSERT INTO worker_verification ( id , worker_id , token ) VALUES ( '${worker_verification_id}' , '${worker_id}' , '${token}' )`
  );
};

const checkWorkerVerification = (queryWorkerId, queryToken) => {
  return Pool.query(
    `SELECT * FROM worker_verification WHERE worker_id='${queryWorkerId}' and token='${queryToken}' `
  );
};

const cekWorker = (worker_email) => {
  return Pool.query(
    `select verify from worker WHERE worker_email='${worker_email}' `
  );
};

const deleteWorkerVerification = (queryWorkerId, queryToken) => {
  return Pool.query(
    `delete from worker_verification WHERE worker_id='${queryWorkerId}' and token='${queryToken}'`
  );
};

const updateAccountVerification = (queryWorkerId) => {
  return Pool.query(
    `update worker set verify='true' WHERE worker_id='${queryWorkerId}' `
  );
};

const selectAllWorker = (sortby, sort) => {
  return Pool.query(`SELECT * FROM worker ORDER BY ${sortby} ${sort}`);
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

const workerPhoto = (data) => {
  const { worker_id, photo } = data;
  return Pool.query(
    `update worker set worker_photo='${photo}' where worker_id='${worker_id}'`
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

const setId = (worker_id) => {
  return Pool.query(`select worker_id,verify from worker where worker_id='${worker_id}'`);
};

const countData = () => {
  return Pool.query("SELECT COUNT(*) FROM worker");
};

module.exports = {
  createUser,
  updateWorker,
  workerPhoto,
  selectWorker,
  selectAllWorker,
  findEmail,
  findId,
  setId,
  countData,
  createWorkerVerification,
  checkWorkerVerification,
  cekWorker,
  deleteWorkerVerification,
  updateAccountVerification,
};
