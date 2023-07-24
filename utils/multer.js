const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/tmp/my-uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: "1MB", fieldSize: "1MB" },
  fileFilter: function fileFilter(req, file, cb) {
    // The function should call `cb` with a boolean
    // to indicate if the file should be accepted
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      // To accept the file pass `true`, like so:
      cb(null, true);
    } else {
      // To reject this file pass `false`, like so:
      cb(null, false);

      // You can always pass an error if something goes wrong:
      cb(new Error(`I only accept jpeg and png not ${file.mimetype}`));
    }
  },
});

module.exports = upload;
