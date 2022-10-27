const { AuthController } = require("../controllers/auth.controllers");

const router = require("express").Router();

router.post("/getOTP", AuthController.getOTP);
router.post("/checkOtp", AuthController.checkOtp);

module.exports = {
  authRoutes: router,
};
