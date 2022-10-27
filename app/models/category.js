const { default: mongoose } = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    parent: {
      type: mongoose.Types.ObjectId,
      default: undefined,
      required: false,
      ref: "category",
    },
  },
  {
    id: false,
    toJSON: {
      virtuals: true,
    },
  }
);
categorySchema.virtual("children", {
  ref: "category",
  localField: "_id",
  foreignField: "parent",
});
categorySchema.pre("find", function (next) {
  this.populate([{ path: "children", select: { __v: 0, id: 0 } }]);
  next();
});
categorySchema.pre("findOne", function (next) {
  this.populate([{ path: "children", select: { __v: 0, id: 0 } }]);
  next();
});

const categoryModel = mongoose.model("category", categorySchema);

module.exports = {
  categoryModel,
};
