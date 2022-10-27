const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (file.originalname) {
      const filePath = path.join(__dirname, "..", "public", "upload");
      req.body.fileUploadPath = filePath;
      return callback(null, filePath);
    }
    return callback(null, null);
  },
  filename: (req, file, callback) => {
    const mimTypes = [".jpg", ".png", "jpeg", "webp"];
    if (file.originalname) {
      const ext = path.extname(file.originalname);
      const fileName = String(new Date().getTime() + ext);
      req.body.fileName = fileName;
      return callback(null, fileName);
    }
    return callback(null, null);
  },
});

//need fileFilter

const uploadFile = multer({ storage });

module.exports = {
  uploadFile,
};
