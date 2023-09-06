const {
  createRecruiter,
  updateRecruiter,
  findEmail,
  findId,
  countData,
} = require("../model/recruiter");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const authHelper = require("../helper/auth");
const commonHelper = require("../helper/common");

const recruiterController = {
  registerUser: async (req, res) => {
    try {
      const {
        recruiter_name,
        recruiter_email,
        recruiter_phone,
        recruiter_password,
        company_name,
        recruiter_position,
      } = req.body;
      const { rowCount } = await findEmail(recruiter_email);
      if (rowCount) {
        return res.json({ messege: "Email is already taken" });
      }
      const passwordHash = bcrypt.hashSync(recruiter_password);
      const recruiter_id = uuidv4();
      const data = {
        recruiter_id,
        recruiter_name,
        recruiter_email,
        recruiter_phone,
        passwordHash,
        company_name,
        recruiter_position,
      };
      createRecruiter(data)
        .then((result) => {
          commonHelper.response(res, result.rows, 201, "User created");
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  },

  loginUser: async (req, res) => {
    try {
      const { recruiter_email, recruiter_password } = req.body;
      const {
        rows: [recruiter],
      } = await findEmail(recruiter_email);
      if (!recruiter) {
        return res.json({ messege: "Email is incorrect" });
      }
      const validPassword = bcrypt.compareSync(
        recruiter_password,
        recruiter.recruiter_password
      );
      if (!validPassword) {
        return res.json({ messege: "password is incorrect" });
      }
      delete recruiter.recruiter_password;
      const payload = {
        email: recruiter.recruiter_email,
      };
      recruiter.token = authHelper.generateToken(payload);
      recruiter.refreshToken = authHelper.refreshToken(payload);
      commonHelper.response(res, recruiter, 201, "Token created");
    } catch (err) {
      console.log(err);
    }
  },

  profile: async (req, res) => {
    const recruiter_email = req.payload.email;
    const {
      rows: [recruiter],
    } = await findEmail(recruiter_email);
    delete recruiter.password;
    commonHelper.response(res, recruiter, 201);
  },
  refreshToken: (req, res) => {
    const RefreshToken = req.body.refreshToken;
    const decoded = jwt.verify(RefreshToken, process.env.SECRETE_KEY_JWT);
    const payload = {
      email: decoded.recruiter_email,
    };
    const result = {
      token: authHelper.generateToken(payload),
      refreshToken: authHelper.refreshToken(payload),
    };
    commonHelper.response(res, result, 200, "Token has refreshed");
  },

  updateRecruiter: async (req, res) => {
    try {
      // const PORT = process.env.PORT || 2525;
      // const DB_HOST = process.env.PGHOST || "localhost";
      const recruiter_id = String(req.params.id);
      // const result = await cloudinary.uploader.upload(req.file.path);
      // const photo = result.secure_url;
      const { recruiter_province, recruiter_city, company_email, company_field, company_phone, company_info } =
        req.body;
      const { rowCount } = await findId(recruiter_id);
      if (!rowCount) {
        res.json({ message: "ID is Not Found" });
      }
      const data = {
        recruiter_id,
        recruiter_province,
        recruiter_city,
        company_email,
        company_field,
        company_phone,
        company_info,
      };
      updateRecruiter(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Account updated")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  //   getAllWorker: async (req, res) => {
  //     try {
  //       const page = Number(req.query.page) || 1;
  //       const limit = Number(req.query.limit) || 1000;
  //       const offset = (page - 1) * limit;
  //       const sortby = req.query.sortby || "worker_name";
  //       const sort = req.query.sort || "ASC";
  //       const result = await selectAllWorker(limit, offset, sortby, sort);
  //       const {
  //         rows: [count],
  //       } = await countData();
  //       const totalData = parseInt(count.count);
  //       const totalPage = Math.ceil(totalData / limit);
  //       const pagination = {
  //         currentPage: page,
  //         limit: limit,
  //         totalData: totalData,
  //         totalPage: totalPage,
  //       };
  //       commonHelper.response(
  //         res,
  //         result.rows,
  //         200,
  //         "get data success",
  //         pagination
  //       );
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   },

  //   getDetailWorker: async (req, res) => {
  //     const id = String(req.params.id);
  //     // const { rowCount } = await findId(id);
  //     // if (!rowCount) {
  //     //   return res.json({ message: "ID Not Found" });
  //     // }
  //     selectWorker(id)
  //       .then((result) => {
  //         commonHelper.response(
  //           res,
  //           result.rows,
  //           200,
  //           "get data success from database"
  //         );
  //       })
  //       .catch((err) => res.send(err));
  //   },
};

module.exports = recruiterController;
