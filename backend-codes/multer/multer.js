const { path } = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload");
  },
  filename: (req, file, cb) => {
    const uniqueString = Date.now + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueString);
  },
});

const upload = multer({ storage: storage }).single("Image");
module.exports = upload;
