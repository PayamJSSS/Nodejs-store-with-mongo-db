const Joi = require("@hapi/joi");

const userSchema = Joi.object({
  mobile: Joi.string()
    .length(11)
    .pattern(/^09[0-9]{9}$/)
    .error(new Error("شماره موبایل ارسالی صحیح نمی باشد")),
});

module.exports = {
  userSchema,
};
