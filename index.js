const express = require("express");
require("dotenv").config();
const app = express();
// const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const createError = require('http-errors');
const xss = require("xss-clean");
const mainRouter = require("./src/routes/index");
const port = 2525;

app.use(express.json());
// app.use(morgan("dev"));
app.use(cors());
app.use(xss());
app.use("/", mainRouter);
app.use(helmet());
app.use('/img', express.static('upload'))
app.all("*", (req, res, next) => {
  next(new createError.NotFound());
});
app.use((err, req, res, next) => {
  const messageError = err.message || "internal server error";
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    message: messageError,
  });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
