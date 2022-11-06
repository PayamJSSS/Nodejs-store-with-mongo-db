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
const Episodes = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  type: { type: String, required: false, default: "free" },
  time: { type: String, required: true },
  videoAddres: { type: String, required: true },
});

const ChapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, default: "" },
  episodes: { type: [Episodes], default: [] },
});
const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    short_text: { type: String, required: true },
    text: { type: String, required: true },
    image: { type: String, required: true },
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
    status: { type: String, default: "started" },
    discount: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    type: { type: String, required: true },
    teacher: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    time: { type: String },
    chapter: { type: [ChapterSchema], default: [] },
  },
  {
    id: false,
    toJSON: {
      virtuals: true,
    },
  }
);
CourseSchema.index({ title: "text", text: "text", short_text: "text" });
const CourseModel = mongoose.model("course", CourseSchema);

module.exports = {
  CourseModel,
};
