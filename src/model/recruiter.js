const Pool = require("../config/db");

// const createRecruiter = (data) => {
//   const {
//     recruiter_id,
//     recruiter_name,
//     recruiter_email,
//     recruiter_phone,
//     passwordHash,
//     company_name,
//     recruiter_position,
//     verify,
//   } = data;
//   const role = "recruiter";
//   return Pool.query(
//     `INSERT INTO recruiter( recruiter_id, recruiter_email, recruiter_name, recruiter_password, recruiter_phone, company_name, role, recruiter_position ) VALUES('${recruiter_id}','${recruiter_email}','${recruiter_name}','${passwordHash}','${recruiter_phone}','${company_name}','${recruiter_position}','${role}','${verify}')`
//   );
// };

const createRecruiter = (
  recruiter_id,
  recruiter_name,
  recruiter_email,
  recruiter_phone,
  passwordHash,
  company_name,
  recruiter_position,
  verify
) => {
  const role = "recruiter";
  return Pool.query(
    `INSERT INTO recruiter( recruiter_id, recruiter_email, recruiter_name, recruiter_password, recruiter_phone, company_name, recruiter_position, role, verify ) VALUES('${recruiter_id}','${recruiter_email}','${recruiter_name}','${passwordHash}','${recruiter_phone}','${company_name}','${recruiter_position}','${role}','${verify}')`
  );
};

const createRecruiterVerification = (
  recruiter_verification_id,
  recruiter_id,
  token
) => {
  return Pool.query(
    `INSERT INTO recruiter_verification ( id , recruiter_id , token ) VALUES ( '${recruiter_verification_id}' , '${recruiter_id}' , '${token}' )`
  );
};

const checkRecruiterVerification = (queryRecruiterId, queryToken) => {
  return Pool.query(
    `SELECT * FROM recruiter_verification WHERE recruiter_id='${queryRecruiterId}' and token='${queryToken}' `
  );
};

const cekRecruiter = (recruiter_email) => {
  return Pool.query(
    `select verify from recruiter WHERE recruiter_email='${recruiter_email}' `
  );
};

const deleteRecruiterVerification = (queryRecruiterId, queryToken) => {
  return Pool.query(
    `delete from recruiter_verification WHERE recruiter_id='${queryRecruiterId}' and token='${queryToken}'`
  );
};

const updateAccountVerification = (queryRecruiterId) => {
  return Pool.query(
    `update recruiter set verify='true' WHERE recruiter_id='${queryRecruiterId}' `
  );
};

const updateRecruiter = (data) => {
  const {
    recruiter_id,
    recruiter_province,
    recruiter_city,
    recruiter_email,
    company_name,
    company_email,
    company_field,
    company_phone,
    company_info,
  } = data;
  return Pool.query(
    `UPDATE recruiter SET recruiter_province='${recruiter_province}', recruiter_city='${recruiter_city}',recruiter_email='${recruiter_email}', company_name='${company_name}', company_email='${company_email}', company_field='${company_field}', company_phone='${company_phone}', company_info='${company_info}' WHERE recruiter_id='${recruiter_id}'`
  );
};

const selectRecruiter = (recruiter_id) => {
  return Pool.query(
    `SELECT * FROM recruiter WHERE recruiter_id='${recruiter_id}'`
  );
};

const findEmail = (recruiter_email) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM recruiter WHERE recruiter_email='${recruiter_email}'`,
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

const findId = (recruiter_id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT recruiter_id FROM recruiter WHERE recruiter_id='${recruiter_id}'`,
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

const findVerify = (recruiter_id) => {
  return Pool.query(
    `SELECT recruiter_id,verify FROM recruiter WHERE recruiter_id='${recruiter_id}'`
  );
};

const countData = () => {
  return Pool.query("SELECT COUNT(*) FROM recruiter");
};

module.exports = {
  createRecruiter,
  updateRecruiter,
  selectRecruiter,
  findEmail,
  findId,
  findVerify,
  countData,
  createRecruiterVerification,
  checkRecruiterVerification,
  cekRecruiter,
  deleteRecruiterVerification,
  updateAccountVerification,
};
