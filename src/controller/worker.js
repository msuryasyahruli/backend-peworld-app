const {
  createUser,
  updateWorker,
  workerPhoto,
  selectWorker,
  selectAllWorker,
  findEmail,
  findId,
  setId,
  createWorkerVerification,
  checkWorkerVerification,
  cekWorker,
  deleteWorkerVerification,
  updateAccountVerification,
  countData,
} = require("../model/worker");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const authHelper = require("../helper/auth");
const commonHelper = require("../helper/common");
const cloudinary = require("../middleware/cloudinary");
const crypto = require("crypto");
const sendEmail = require("../middleware/sendEmail");
const createError = require("http-errors");

const workerController = {
  // registerUser: async (req, res) => {
  //   try {
  //     const { worker_name, worker_email, worker_phone, worker_password } =
  //       req.body;
  //     const { rowCount } = await findEmail(worker_email);
  //     if (rowCount) {
  //       return res.json({ messege: "Email is already taken" });
  //     }
  //     const passwordHash = bcrypt.hashSync(worker_password);
  //     const worker_id = uuidv4();
  //     const data = {
  //       worker_id,
  //       worker_name,
  //       worker_email,
  //       worker_phone,
  //       passwordHash,
  //       role: "worker",
  //     };
  //     createUser(data)
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
      const { worker_name, worker_phone, worker_email, worker_password } =
        req.body;
      const checkEmail = await findEmail(worker_email);

      try {
        if (checkEmail.rowCount == 1) throw "Email already used";
      } catch (error) {
        delete checkEmail.rows[0].worker_password;
        return commonHelper.response(res, null, 403, error);
      }

      // users
      const saltRounds = 10;
      const passwordHash = bcrypt.hashSync(worker_password, saltRounds);
      const worker_id = uuidv4().toLocaleLowerCase();

      // verification
      const verify = "false";

      const users_verification_id = uuidv4().toLocaleLowerCase();
      // const worker_id = id;
      const token = crypto.randomBytes(64).toString("hex");

      // url localhost
      const url = `${process.env.BASE_URL}worker/verify?id=${worker_id}&token=${token}`;

      // url deployment
      // const url = `${process.env.BASE_URL}/verification?type=email&id=${users_id}&token=${token}`;

      //send email
      await sendEmail(worker_email, "Verify Email", url);

      // insert db table users
      await createUser(
        worker_id,
        worker_name,
        worker_email,
        worker_phone,
        passwordHash,
        verify
      );

      // insert db table verification
      await createWorkerVerification(users_verification_id, worker_id, token);

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
      const queryWorkerId = req.query.id;
      const queryToken = req.query.token;

      if (typeof queryWorkerId === "string" && typeof queryToken === "string") {
        const checkUsersVerify = await setId(queryWorkerId);

        if (checkUsersVerify.rowCount == 0) {
          return commonHelper.response(
            res,
            null,
            403,
            "Error users has not found"
          );
        }

        // console.log(checkUsersVerify);
        if (checkUsersVerify.rows[0].verify != "false") {
          return commonHelper.response(
            res,
            null,
            403,
            "Users has been verified"
          );
        }

        const result = await checkWorkerVerification(queryWorkerId, queryToken);

        if (result.rowCount == 0) {
          return commonHelper.response(
            res,
            null,
            403,
            "Error invalid credential verification"
          );
        } else {
          await updateAccountVerification(queryWorkerId);
          await deleteWorkerVerification(queryWorkerId, queryToken);
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
  //     const { worker_email, worker_password } = req.body;
  //     const {
  //       rows: [worker],
  //     } = await findEmail(worker_email);
  //     if (!worker) {
  //       return res.json({ messege: "Email is incorrect" });
  //     }
  //     const validPassword = bcrypt.compareSync(
  //       worker_password,
  //       worker.worker_password
  //     );
  //     if (!validPassword) {
  //       return res.json({ messege: "password is incorrect" });
  //     }
  //     delete worker.worker_password;
  //     const payload = {
  //       email: worker.worker_email,
  //     };
  //     worker.token = authHelper.generateToken(payload);
  //     worker.refreshToken = authHelper.refreshToken(payload);
  //     commonHelper.response(res, worker, 201, "Token created");
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },

  loginUser: async (req, res, next) => {
    try {
      const { worker_email, worker_password } = req.body;
      const {
        rows: [verify],
      } = await cekWorker(worker_email);
      // console.log(verify.verify);
      if (verify.verify === "false") {
        return res.json({
          message: "user is unverify",
        });
      }
      const {
        rows: [user],
      } = await findEmail(worker_email);
      if (!user) {
        return commonHelper.response(res, null, 403, "Email is invalid");
      }
      const isValidPassword = bcrypt.compareSync(
        worker_password,
        user.worker_password
      );
      // console.log(isValidPassword);

      if (!isValidPassword) {
        return commonHelper.response(res, null, 403, "Password is invalid");
      }
      delete user.worker_password;
      const payload = {
        worker_email: user.worker_email,
        role: user.role,
      };
      user.token = authHelper.generateToken(payload);
      user.refreshToken = authHelper.refreshToken(payload);

      commonHelper.response(res, user, 201, "login is successful");
    } catch (error) {
      console.log(error);
    }
  },

  sendEmail: async (req, res, next) => {
    const { worker_email } = req.body;
    await sendEmail(worker_email, "Verify Email", url);
  },

  profile: async (req, res) => {
    const worker_email = req.payload.email;
    const {
      rows: [worker],
    } = await findEmail(worker_email);
    delete worker.worker_password;
    commonHelper.response(res, worker, 201);
  },

  refreshToken: (req, res) => {
    const RefreshToken = req.body.refreshToken;
    const decoded = jwt.verify(RefreshToken, process.env.SECRETE_KEY_JWT);
    const payload = {
      worker_email: decoded.worker_email,
    };
    const result = {
      token: authHelper.generateToken(payload),
      refreshToken: authHelper.refreshToken(payload),
    };
    commonHelper.response(res, result, 200, "Token has refreshed");
  },

  updateWorker: async (req, res) => {
    try {
      const worker_id = String(req.params.id);
      // const result = await cloudinary.uploader.upload(req.file.path);
      // const photo = result.secure_url;
      const {
        worker_name,
        worker_jobdesk,
        worker_province,
        worker_city,
        worker_workplace,
        worker_description,
      } = req.body;
      const { rowCount } = await findId(worker_id);
      if (!rowCount) {
        res.json({ message: "ID is Not Found" });
      }
      const data = {
        worker_id,
        worker_name,
        worker_jobdesk,
        worker_province,
        worker_city,
        worker_workplace,
        worker_description,
      };
      updateWorker(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Account updated")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  workerPhoto: async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);
      const photo = result.secure_url;
      const worker_id = String(req.params.id);
      const { rowCount } = await findId(worker_id);
      if (!rowCount) {
        res.json({ message: "ID is Not Found" });
      }
      const data = {
        worker_id,
        photo,
      };
      workerPhoto(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Photo updated")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  getAllWorker: async (req, res) => {
    try {
      const sortby = req.query.sortby || "worker_id";
      const sort = req.query.sort || "ASC";
      const result = await selectAllWorker(sortby, sort);
      commonHelper.response(res, result.rows, 200, "get data success");
    } catch (error) {
      console.log(error);
    }
  },

  getDetailWorker: async (req, res) => {
    const worker_id = String(req.params.id);
    // const { rowCount } = await findId(id);
    // if (!rowCount) {
    //   return res.json({ message: "ID Not Found" });
    // }
    selectWorker(worker_id)
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

module.exports = workerController;
