// const multer = require("multer");
// const createError = require("http-errors");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./src/upload");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + "-" + uniqueSuffix + ".png");
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 2,
//   },
//   fileFilter: function (req, file, cb) {
//     const validFile = ["jpeg", "jpg", "png"];
//     const extention = file.mimetype.split("/")[1];
//     if (validFile.includes(extention)) {
//       return cb(null, true);
//     } else {
//       return cb(
//         new createError(400, "The file format must be JPEG, JPG or PNG"),
//         false
//       );
//     }
//   },
// });

// module.exports = upload;


const multer = require('multer');
const { failed } = require('../helper/common');
// manajemen file
const multerUpload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    const fileSize = parseInt(req.headers['content-length']);
    const maxSize = 2 * 1024 * 1024;
    if (fileSize > maxSize) {
      const error = {
        message: 'File size exceeds 2 MB',
      };
      return cb(error, false);
    }
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg'
    ) {
      cb(null, true);
    } else {
      const error = {
        message: 'file must be jpeg,jpg or png',
      };
      cb(error, false);
    }
  },
});

// middleware
const upload = (req, res, next) => {
  const multerSingle = multerUpload.single('photo');
  multerSingle(req, res, (err) => {
    if (err) {
      failed(res, {
        code: 500,
        status: 'error',
        message: err.message,
        error: [],
      });
    } else {
      next();
    }
  });
};

module.exports = upload;