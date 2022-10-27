const JWT = require("jsonwebtoken");
const { SECRET_KEY } = require("../functions/tokenGenerator");
const createError = require("http-errors");
const { userModel } = require("../models/user");

async function verifyLogin(req, res, next) {
  try {
    const headers = req.headers;
    const [bearer, token] = headers?.authorization?.split(" ") || [];
    if (token) {
      const result = JWT.verify(token, SECRET_KEY);
      const { mobile } = result;
      const user = await userModel.findOne({ mobile });
      if (!user) return next(createError.NotFound("کاربری یافت نشد"));
      req.user = user;
      return next();
    }
    return next(createError.Unauthorized("وارد حساب کاربری خود شوید"));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  verifyLogin,
};
