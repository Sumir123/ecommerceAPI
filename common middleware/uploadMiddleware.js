const multer = require("multer");
const path = require("path");
const shortid = require("shortid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message, field: err.field });
  } else if (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
  next();
};

const uploadMiddleware = (fieldName) => (req, res, next) => {
  const multerUpload = upload.single(fieldName);
  multerUpload(req, res, (err) => handleMulterErrors(err, req, res, next));
};

module.exports = { uploadMiddleware };
