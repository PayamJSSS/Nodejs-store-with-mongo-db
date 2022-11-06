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
const blogSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    short_text: { type: String, required: true },
    image: { type: String, required: false },
    tags: { type: [String], default: [] },
    category: {
      ref: "user",
      type: [mongoose.Types.ObjectId],
      ref: "category",
      required: true,
    },
    comments: { type: [CommentSchema], default: [] },
    likes: { type: [mongoose.Types.ObjectId], ref: "user", default: [] },
    dislikes: { type: [mongoose.Types.ObjectId], ref: "user", default: [] },
    bookmarks: { type: [mongoose.Types.ObjectId], ref: "user", default: [] },
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
