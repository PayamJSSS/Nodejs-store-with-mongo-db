const JWT = require("jsonwebtoken");
const { userModel } = require("../models/user");
const SECRET_KEY = "ASDSAN2KN2KNE32KDRGRGWWXFGT";
const signAccessToken = (userId) => {
  try {
    return new Promise(async (resolve, reject) => {
      const user = await userModel.findById(userId);
      const payload = {
        mobile: user.mobile,
      };
      JWT.sign(payload, SECRET_KEY, { expiresIn: "30days" }, (err, token) => {
        if (err) reject(new Error("خطای سروری"));
        resolve(token);
      });
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  signAccessToken,
  SECRET_KEY,
};
