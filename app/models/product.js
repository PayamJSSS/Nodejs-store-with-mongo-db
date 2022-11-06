const { default: mongoose } = require("mongoose");

const AnswerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    content: { type: String, required: true },
    show: { type: Boolean, required: true, default: false },
    openToComment: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: true },
  }
);
const CommentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    content: { type: String, required: true },
    show: { type: Boolean, required: true, default: false },
    openToComment: { type: Boolean, default: true },
    answers: { type: [AnswerSchema], default: [] },
  },
  {
    timestamps: { createdAt: true },
  }
);
const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    short_text: { type: String, required: true },
    text: { type: String, required: true },
    images: { type: [String], required: true },
    tags: { type: [String], required: false, default: [] },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
      required: true,
    },
    comments: { type: [CommentSchema], required: false, default: [] },
    likes: { type: [mongoose.Types.ObjectId], default: [] },
    dislikes: { type: [mongoose.Types.ObjectId], default: [] },
    bookmarks: { type: [mongoose.Types.ObjectId], default: [] },
    price: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    type: { type: String, required: true },
    supplier: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    features: {
      type: Object,
      default: {
        length: "",
        height: "",
        weight: "",
        width: "",
      },
    },
  },
  {
    toJSON: { virtuals: true },
  }
);
ProductSchema.virtual("subField", {
  ref: "user",
  localField: "supplier",
  foreignField: "_id",
});

const productModel = mongoose.model("product", ProductSchema);

module.exports = {
  productModel,
};
