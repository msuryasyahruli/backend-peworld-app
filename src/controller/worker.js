const {
  createUser,
  updateWorker,
  selectWorker,
  selectAllWorker,
  findEmail,
  findId,
  countData,
} = require("../model/worker");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const authHelper = require("../helper/auth");
const commonHelper = require("../helper/common");

const workerController = {
  registerUser: async (req, res) => {
    try {
      const { worker_name, worker_email, worker_phone, worker_password } =
        req.body;
      const { rowCount } = await findEmail(worker_email);
      if (rowCount) {
        return res.json({ messege: "Email is already taken" });
      }
      const passwordHash = bcrypt.hashSync(worker_password);
      const worker_id = uuidv4();
      const data = {
        worker_id,
        worker_name,
        worker_email,
        worker_phone,
        passwordHash,
        role: "worker",
      };
      createUser(data)
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
      const { worker_email, worker_password } = req.body;
      const {
        rows: [worker],
      } = await findEmail(worker_email);
      if (!worker) {
        return res.json({ messege: "Email is incorrect" });
      }
      const validPassword = bcrypt.compareSync(
        worker_password,
        worker.worker_password
      );
      if (!validPassword) {
        return res.json({ messege: "password is incorrect" });
      }
      delete worker.worker_password;
      const payload = {
        email: worker.worker_email,
      };
      worker.token = authHelper.generateToken(payload);
      worker.refreshToken = authHelper.refreshToken(payload);
      commonHelper.response(res, worker, 201, "Token created");
    } catch (err) {
      console.log(err);
    }
  },

  profile: async (req, res) => {
    const email = req.payload.email;
    const {
      rows: [worker],
    } = await findEmail(email);
    delete worker.worker_password;
    commonHelper.response(res, worker, 201);
  },
  refreshToken: (req, res) => {
    const RefreshToken = req.body.refreshToken;
    const decoded = jwt.verify(RefreshToken, process.env.SECRETE_KEY_JWT);
    const payload = {
      email: decoded.worker_email,
    };
    const result = {
      token: authHelper.generateToken(payload),
      refreshToken: authHelper.refreshToken(payload),
    };
    commonHelper.response(res, result, 200, "Token has refreshed");
  },

  updateWorker: async (req, res) => {
    try {
      const PORT = process.env.PORT || 2525;
      const DB_HOST = process.env.PGHOST || "localhost";
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

  getAllWorker: async (req, res) => {
    try {
      const sortby = req.query.sortby || "worker_id";
      const sort = req.query.sort || "ASC";
      const result = await selectAllWorker(sortby, sort);
      commonHelper.response(
        res,
        result.rows,
        200,
        "get data success"
      );
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
