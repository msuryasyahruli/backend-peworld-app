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
      const { name, email, phone, password } = req.body;
      const { rowCount } = await findEmail(email);
      if (rowCount) {
        return res.json({ messege: "Email is already taken" });
      }
      const passwordHash = bcrypt.hashSync(password);
      const id = uuidv4();
      const data = {
        id,
        email,
        name,
        phone,
        passwordHash,
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
      const { email, password } = req.body;
      const {
        rows: [worker],
      } = await findEmail(email);
      if (!worker) {
        return res.json({ messege: "Email is incorrect" });
      }
      const validPassword = bcrypt.compareSync(
        password,
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
    delete worker.password;
    commonHelper.response(res, worker, 201);
  },
  refreshToken: (req, res) => {
    const RefreshToken = req.body.refreshToken;
    const decoded = jwt.verify(RefreshToken, process.env.SECRETE_KEY_JWT);
    const payload = {
      email: decoded.email,
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
      const id = String(req.params.id);
      // const result = await cloudinary.uploader.upload(req.file.path);
      // const photo = result.secure_url;
      const { name, province, city, workplace, description } = req.body;
      const { rowCount } = await findId(id);
      if (!rowCount) {
        res.json({ message: "ID is Not Found" });
      }
      const data = {
        id,
        name,
        province,
        city,
        workplace,
        description,
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
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 1000;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "worker_name";
      const sort = req.query.sort || "ASC";
      const result = await selectAllWorker(limit, offset, sortby, sort);
      const {
        rows: [count],
      } = await countData();
      const totalData = parseInt(count.count);
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        currentPage: page,
        limit: limit,
        totalData: totalData,
        totalPage: totalPage,
      };
      commonHelper.response(
        res,
        result.rows,
        200,
        "get data success",
        pagination
      );
    } catch (error) {
      console.log(error);
    }
  },
  getDetailWorker: async (req, res) => {
    const id = String(req.params.id);
    // const { rowCount } = await findId(id);
    // if (!rowCount) {
    //   return res.json({ message: "ID Not Found" });
    // }
    selectWorker(id)
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
