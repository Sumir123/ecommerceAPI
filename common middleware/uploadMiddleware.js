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
    console.log(err);
    return res.status(400).json({ error: err.message, field: err.field });
  } else if (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
  next();
};

const uploadMiddleware =
  (fieldName, uploadType = "single") =>
  (req, res, next) => {
    if (uploadType === "single") {
      const multerUpload = upload.single(fieldName);
      multerUpload(req, res, (err) => handleMulterErrors(err, req, res, next));
    } else if (uploadType === "array") {
      const multerUpload = upload.array(fieldName);
      multerUpload(req, res, (err) => handleMulterErrors(err, req, res, next));
    } else {
      return res.status(500).json({ error: "Invalid upload type" });
    }
  };

module.exports = { uploadMiddleware };
