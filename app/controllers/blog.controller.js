const { blogModel } = require("../models/blogs");
const createError = require("http-errors");
const autoBind = require("auto-bind");
class BlogController {
  constructor() {
    autoBind(this);
  }
  async createBlog(req, res, next) {
    try {
      const { title, text, short_text, category } = req.body;
      console.log(req.user);
      const author = req.user._id;
      const blog = await blogModel.create({
        title,
        text,
        short_text,
        category,
        author,
      });
      return res.status(200).json({
        status: 200,
        blog,
      });
    } catch (error) {
      next(error);
    }
  }
  async getOneBlogById(req, res, next) {
    try {
      const { id } = req.params;
      const blog = await blogModel.findOne({ _id: id }).populate([
        { path: "category", select: { title: 1 } },
        { path: "author", select: { mobile: 1 } },
      ]);
      if (!blog) throw createError.NotFound("بلاگ مورد نظر یافت نشد");
      return res.status(200).json({
        status: 200,
        blog,
      });
    } catch (error) {
      next(error);
    }
  }
  async getListOfBlogs(req, res, next) {
    try {
      const blog = await blogModel.find({}).populate([
        { path: "category", select: { title: 1 } },
        { path: "author", select: { mobile: 1 } },
      ]);
      return res.status(200).json({
        status: 200,
        blog,
      });
    } catch (error) {
      next(error);
    }
  }
  async updateBlogById(req, res, next) {
    try {
      const data = req.body;
      const { id } = req.params;
      Object.keys(data).forEach((key) => {
        if (["", " ", null, undefined, NaN, 0].includes(data[key]))
          delete data[key];
        // if (["text", "short_text", "likes", "dislikes", "author"].includes(key))
        //   delete data[key];
        if (typeof data[key] == "string") data[key] = data[key].trim();
      });
      const updateResult = await blogModel.updateOne(
        { _id: id },
        { $set: data }
      );
      if (updateResult.modifiedCount == 0)
        throw createError.InternalServerError("بروز رسانی انجام نشد");
      return res.status(200).json({
        status: 200,
        message: "بروز رسانی با موفقیت انجام شد",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  BlogController: new BlogController(),
};
