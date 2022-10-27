const stringToArray = function (field) {
  return function (req, res, next) {
    if (req.body[field]) {
      if (typeof req.body[field] == "string") {
        if (req.body[field].indexOf("#") >= 0) {
          req.body[field] = req.body[field]
            .split("#")
            .map((item) => item.trim());
        }
      } else if (Array.isArray(req.body[field] === true)) {
        req.body[field] = req.body[field].map((item) => item.trim());
      }
    } else {
      req.body[field] = [];
    }
  };
};

module.exports = {
  stringToArray,
};
