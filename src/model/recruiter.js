const Pool = require("../config/db");

const createRecruiter = (data) => {
  const {
    recruiter_id,
    recruiter_name,
    recruiter_email,
    recruiter_phone,
    passwordHash,
    company_name,
    recruiter_position,
  } = data;
  const role = "recruiter";
  return Pool.query(
    `INSERT INTO recruiter( recruiter_id, recruiter_email, recruiter_name, recruiter_password, recruiter_phone, company_name, role, recruiter_position ) VALUES('${recruiter_id}','${recruiter_email}','${recruiter_name}','${passwordHash}','${recruiter_phone}','${company_name}','${role}','${recruiter_position}')`
  );
};

const updateRecruiter = (data) => {
  const {
    recruiter_id,
    recruiter_province,
    recruiter_city,
    company_email,
    company_field,
    company_phone,
    company_info,
  } = data;
  return Pool.query(
    `UPDATE recruiter SET recruiter_province='${recruiter_province}', recruiter_city='${recruiter_city}', company_email='${company_email}', company_field='${company_field}', company_phone='${company_phone}', company_info='${company_info}' WHERE recruiter_id='${recruiter_id}'`
  );
};

const selectRecruiter = (recruiter_id) => {
  return Pool.query(`SELECT * FROM recruiter WHERE recruiter_id='${recruiter_id}'`);
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

const countData = () => {
  return Pool.query("SELECT COUNT(*) FROM recruiter");
};

module.exports = {
  createRecruiter,
  updateRecruiter,
  selectRecruiter,
  findEmail,
  findId,
  countData,
};
