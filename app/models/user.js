const { default: mongoose } = require("mongoose");

const CourseSchema = new mongoose.Schema({
  courseID: { type: mongoose.Types.ObjectId, ref: "course" },
  count: { type: Number, default: 1 },
});
const ProductSchema = new mongoose.Schema({
  productID: { type: mongoose.Types.ObjectId, ref: "product" },
  count: { type: Number, default: 1 },
});
const BasketSchema = new mongoose.Schema({
  product: { type: [ProductSchema], default: [] },
  course: { type: [CourseSchema], default: [] },
});
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
    basket: { type: BasketSchema },
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
