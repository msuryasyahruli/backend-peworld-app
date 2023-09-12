const {
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
} = require("../model/recruiter");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const authHelper = require("../helper/auth");
const commonHelper = require("../helper/common");
const cloudinary = require("../middleware/cloudinary");
const crypto = require("crypto");
const sendEmail = require("../middleware/sendEmail");
const createError = require("http-errors");

const recruiterController = {
  // registerUser: async (req, res) => {
  //   try {
  //     const {
  //       recruiter_name,
  //       recruiter_email,
  //       recruiter_phone,
  //       recruiter_password,
  //       company_name,
  //       recruiter_position,
  //     } = req.body;
  //     const { rowCount } = await findEmail(recruiter_email);
  //     if (rowCount) {
  //       return res.json({ messege: "Email is already taken" });
  //     }
  //     const passwordHash = bcrypt.hashSync(recruiter_password);
  //     const recruiter_id = uuidv4();
  //     const data = {
  //       recruiter_id,
  //       recruiter_name,
  //       recruiter_email,
  //       recruiter_phone,
  //       passwordHash,
  //       company_name,
  //       recruiter_position,
  //     };
  //     createRecruiter(data)
  //       .then((result) => {
  //         commonHelper.response(res, result.rows, 201, "User created");
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },

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
      const checkEmail = await findEmail(recruiter_email);
      try {
        if (checkEmail.rowCount == 1) throw "Email already used";
      } catch (error) {
        delete checkEmail.rows[0].recruiter_passwordrecruiter_password;
        return commonHelper.response(res, null, 403, error);
      }
      const saltRounds = 10;
      const passwordHash = bcrypt.hashSync(recruiter_password, saltRounds);
      const recruiter_id = uuidv4().toLocaleLowerCase();
      const verify = "false";
      const users_verification_id = uuidv4().toLocaleLowerCase();
      const token = crypto.randomBytes(64).toString("hex");
      const url = `${process.env.BASE_URL}recruiter/verify?id=${recruiter_id}&token=${token}`;
      // url deployment
      // const url = `${process.env.BASE_URL}/verification?type=email&id=${users_id}&token=${token}`;
      await sendEmail(recruiter_email, "Verify Email", url);
      await createRecruiter(
        recruiter_id,
        recruiter_name,
        recruiter_email,
        recruiter_phone,
        passwordHash,
        company_name,
        recruiter_position,
        verify
      );
      await createRecruiterVerification(
        users_verification_id,
        recruiter_id,
        token
      );
      commonHelper.response(
        res,
        null,
        201,
        "Sign Up Success, Please check your email for verification"
      );
    } catch (error) {
      console.log(error);
      res.send(createError(400));
    }
  },

  VerifyAccount: async (req, res) => {
    try {
      const queryRecruiterId = req.query.id;
        const queryToken = req.query.token;
      if (typeof queryRecruiterId === "string" && typeof queryToken === "string") {
        const checkUsersVerify = await findVerify(queryRecruiterId);
        if (checkUsersVerify.rowCount == 0) {
          return commonHelper.response(
            res,
            null,
            403,
            "Error users has not found"
          );
        }
        if (checkUsersVerify.rows[0].verify != "false") {
          return commonHelper.response(
            res,
            null,
            403,
            "Users has been verified"
          );
        }
        const result = await checkRecruiterVerification(queryRecruiterId, queryToken);
        if (result.rowCount == 0) {
          return commonHelper.response(
            res,
            null,
            403,
            "Error invalid credential verification"
          );
        } else {
          await updateAccountVerification(queryRecruiterId);
          await deleteRecruiterVerification(queryRecruiterId, queryToken);
          commonHelper.response(res, null, 200, "Users verified succesful");
        }
      } else {
        return commonHelper.response(
          res,
          null,
          403,
          "Invalid url verification"
        );
      }
    } catch (error) {
      console.log(error);
      res.send(createError(404));
    }
  },

  // loginUser: async (req, res) => {
  //   try {
  //     const { recruiter_email, recruiter_password } = req.body;
  //     const {
  //       rows: [recruiter],
  //     } = await findEmail(recruiter_email);
  //     if (!recruiter) {
  //       return res.json({ messege: "Email is incorrect" });
  //     }
  //     const validPassword = bcrypt.compareSync(
  //       recruiter_password,
  //       recruiter.recruiter_password
  //     );
  //     if (!validPassword) {
  //       return res.json({ messege: "password is incorrect" });
  //     }
  //     delete recruiter.recruiter_password;
  //     const payload = {
  //       email: recruiter.recruiter_email,
  //     };
  //     recruiter.token = authHelper.generateToken(payload);
  //     recruiter.refreshToken = authHelper.refreshToken(payload);
  //     commonHelper.response(res, recruiter, 201, "Token created");
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },

  loginUser: async (req, res, next) => {
    try {
      const { recruiter_email, recruiter_password } = req.body;
      const {
        rows: [verify],
      } = await cekRecruiter(recruiter_email);
      if (verify.verify === "false") {
        return res.json({
          message: "user is unverify",
        });
      }
      const {
        rows: [user],
      } = await findEmail(recruiter_email);
      if (!user) {
        return commonHelper.response(res, null, 403, "Email is invalid");
      }
      const isValidPassword = bcrypt.compareSync(
        recruiter_password,
        user.recruiter_password
      );
      if (!isValidPassword) {
        return commonHelper.response(res, null, 403, "Password is invalid");
      }
      delete user.recruiter_password;
      const payload = {
        recruiter_email: user.recruiter_email,
        role: user.role,
      };
      user.token = authHelper.generateToken(payload);
      user.refreshToken = authHelper.refreshToken(payload);
      commonHelper.response(res, user, 201, "login is successful");
    } catch (error) {
      console.log(error);
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
      const recruiter_id = String(req.params.id);
      // const result = await cloudinary.uploader.upload(req.file.path);
      // const photo = result.secure_url;
      const {
        recruiter_province,
        recruiter_city,
        recruiter_email,
        company_name,
        company_email,
        company_field,
        company_phone,
        company_info,
      } = req.body;
      const { rowCount } = await findId(recruiter_id);
      if (!rowCount) {
        res.json({ message: "ID is Not Found" });
      }
      const data = {
        recruiter_id,
        recruiter_province,
        recruiter_city,
        recruiter_email,
        company_name,
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

  getDetailRecruiter: async (req, res) => {
    const recruiter_id = String(req.params.id);
    // const { rowCount } = await findId(id);
    // if (!rowCount) {
    //   return res.json({ message: "ID Not Found" });
    // }
    selectRecruiter(recruiter_id)
      .then((result) => {
        commonHelper.response(
          res,
          result.rows,
          200,
          "get data success from database"
        );
      })
      .catch((err) => res.send(err));
  },
};

module.exports = recruiterController;
