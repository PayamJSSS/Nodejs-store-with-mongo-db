const { default: mongoose } = require("mongoose");

const CommentSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
  parent: { type: mongoose.Types.ObjectId, ref: "comment", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: new Date().getTime() },
});
const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  short_text: { type: String, required: true },
  text: { type: String, required: true },
  images: { type: [String], required: true },
  tags: { type: [String], required: false, default: [] },
  category: { type: mongoose.Types.ObjectId, ref: "category", required: true },
  comments: { type: [CommentSchema], required: false, default: [] },
  likes: { type: [mongoose.Types.ObjectId], default: [] },
  dislikes: { type: [mongoose.Types.ObjectId], default: [] },
  bookmarks: { type: [mongoose.Types.ObjectId], default: [] },
  price: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  count: { type: Number, default: 0 },
  type: { type: String, required: true },
  supplier: { type: mongoose.Types.ObjectId, required: true },
  features: {
    type: Object,
    default: {
      length: "",
      height: "",
      weight: "",
      width: "",
    },
  },
});

const productModel = mongoose.model("product", ProductSchema);

module.exports = {
  productModel,
};
