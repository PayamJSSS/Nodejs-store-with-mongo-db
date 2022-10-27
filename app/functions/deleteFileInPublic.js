const path = require("path");
const fs = require("fs");

function deleteFileInPublic(filename) {
  if (filename) {
    const filePath = path.join(__dirname, "..", "public", "upload", filename);

    fs.unlinkSync(filePath);
  }
}

module.exports = {
  deleteFileInPublic,
};
