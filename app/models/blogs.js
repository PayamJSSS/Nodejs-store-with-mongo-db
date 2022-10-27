const { default: mongoose } = require("mongoose");

const CommentSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: new Date().getTime() },
  parent: { type: mongoose.Types.ObjectId },
});
const blogSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    short_text: { type: String, required: true },
    image: { type: String, required: false },
    tags: { type: [String], default: [] },
    category: {
      type: [mongoose.Types.ObjectId],
      ref: "category",
      required: true,
    },
    coments: { type: [CommentSchema], default: [] },
    likes: { type: [mongoose.Types.ObjectId], default: [] },
    dislikes: { type: [mongoose.Types.ObjectId], default: [] },
    bookmark: { type: [mongoose.Types.ObjectId], default: [] },
  },
  {
    id: false,
    toJSON: {
      virtuals: true,
    },
  }
);
blogSchema.virtual("category_detail", {
  ref: "category",
  localField: "category",
  foreignField: "parent",
});
blogSchema.virtual("user", {
  ref: "user",
  localField: "author",
  foreignField: "_id",
});

const blogModel = mongoose.model("blog", blogSchema);

module.exports = {
  blogModel,
};
