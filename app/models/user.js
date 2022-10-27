const { default: mongoose } = require("mongoose");

const userSchema = mongoose.Schema(
  {
    first_name: { type: String },
    last_name: { type: String },
    username: { type: String },
    password: { type: String },
    email: { type: String },
    mobile: { type: String, required: true },
    otp: {
      type: Object,
      default: {
        code: 0,
        expiresIn: 0,
      },
    },
    roles: { type: [String], default: ["User"] },
    discount: { type: Number, default: 0 },
  },
  {
    id: false,
    toJSON: {
      virtuals: true,
    },
  }
);

const userModel = mongoose.model("user", userSchema);

module.exports = {
  userModel,
};
