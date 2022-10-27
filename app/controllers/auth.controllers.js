const autoBind = require("auto-bind");
const { randomNumberGenerator } = require("../functions/randonNumberGenerator");
const { signAccessToken } = require("../functions/tokenGenerator");
const { userModel } = require("../models/user");
const { userSchema } = require("../validations/userValidation");

class AuthController {
  constructor() {
    autoBind(this);
  }
  async getOTP(req, res, next) {
    try {
      const { mobile } = req.body;
      await userSchema.validateAsync(req.body);
      const code = randomNumberGenerator();
      const result = await this.saveUser(mobile, code);
      if (!result)
        throw {
          status: 400,
          message: "در خواست رمز یک بار مصرف موفقیت امیز نبود",
        };
      return res.status(200).json({
        status: 200,
        message: "کد اعتبار سنجی با موفقیت ارسال شد",
        code,
        mobile,
      });
    } catch (error) {
      next(error);
    }
  }

  async checkOtp(req, res, next) {
    try {
      const { mobile, code } = req.body;

      const user = await userModel.findOne({ mobile });
      if (!user)
        throw { status: 404, message: "کاربری با این مشخصات یافت نشد" };
      if (user.otp.code != code)
        throw { status: 400, message: "کد ارسالی صحیح نمی باشد" };
      const now = new Date().getTime();
      if (user.otp.expiresIn < now)
        throw { status: 400, message: "کد شما منقضی شده است" };
      const token = await signAccessToken(user._id);
      return res.status(200).json({
        status: 200,
        mobile,
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  async saveUser(mobile, code) {
    let otp = {
      code,
      expiresIn: new Date().getTime() + 120000,
    };
    const result = await this.checkExistUser(mobile);
    if (result) {
      return await this.updateUser(mobile, { otp });
    }
    return !!(await userModel.create({
      otp,
      mobile,
    }));
  }
  async checkExistUser(mobile) {
    const result = await userModel.findOne({ mobile });
    return !!result;
  }
  async updateUser(mobile, objectData = {}) {
    const updatedUser = await userModel.updateOne(
      { mobile },
      { $set: objectData }
    );
    if (updatedUser.modifiedCount === 0)
      throw { status: 500, message: "خطای سروری" };
    return !!updatedUser.modifiedCount;
  }
}

module.exports = {
  AuthController: new AuthController(),
};
