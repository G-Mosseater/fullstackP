const fileUpload = require("express-fileupload");

const upload = fileUpload({
  useTempFiles: false,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = upload;

// const multer = require("multer");
// const { v4: uuidv4 } = require("uuid");

// const MIME_TYPE = {
//   "image/png": "png",
//   "image/jpeg": "jpeg",
//   "image/jpg": "jpg",
// };

// const fileUpload = multer({
//   limits: 5000000,
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, "uploads/images");
//     },
//     filename: (req, file, cb) => {
//       const ext = MIME_TYPE[file.mimetype];
//       cb(null, uuidv4() + "." + ext);
//     },
//   }),
//   fileFilter: (req, file, cb) => {
//     const isValid = !!MIME_TYPE[file.mimetype];
//     let error = isValid ? null : new Error("Invalid mime type!");
//     cb(error, isValid);
//   },
// });

// module.exports = fileUpload;
