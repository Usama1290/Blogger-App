
const multer = require("multer");
const path = require("path");


//multer for storing BlogImages
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./BlogImages"));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

module.exports={upload}