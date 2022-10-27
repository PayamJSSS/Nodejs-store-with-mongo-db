const path = require("path");
function listOfImages(req) {
  let images;
  if (req.files.length > 0) {
    images = req.files
      .map((file) => path.join(req.body.fileUploadPath, req.body.fileName))
      .map((item) => item.replace(/\\/g, "/"));
  } else {
    images = [];
  }
  return images;
}

module.exports = {
  listOfImages,
};
