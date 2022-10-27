const autoBind = require("auto-bind");
const { CourseModel } = require("../../models/course");
const createError = require("http-errors");
const path = require("path");
const { deleteFileInPublic } = require("../../functions/deleteFileInPublic");
class CourseController {
  constructor() {
    autoBind(this);
  }

  async addCourse(req, res, next) {
    try {
      const { title, text, short_text, category, price, count } = req.body;
      // teacher,image,type,
      let type;
      if (price > 0) type = "cash";
      else type = "free";
      let image;
      if (req.file) {
        const filePath = path.join(req.body.fileUploadPath, req.body.fileName);
        image = filePath.replace(/\\/g, "/");
      } else {
        image = "";
      }
      const teacher = req.user._id;

      const course = await CourseModel.create({
        title,
        text,
        short_text,
        category,
        price,
        count,
        teacher,
        image,
        type,
      });
      if (!course._id) throw createError.InternalServerError("دوره ساخته نشد");
      return res.status(200).json({
        status: 200,
        data: {
          course,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async removeCourseById(req, res, next) {
    try {
      const { courseID } = req.params;

      const course = await CourseModel.findById(courseID);
      if (!course)
        throw createError.NotFound("دوره ای با شناسه ی ارسالی یافت نشد");
      const deletCourseResult = await CourseModel.deleteOne({ _id: courseID });
      if (deletCourseResult.deletedCount == 0)
        throw createError.InternalServerError("دوره حذف نشد");
      return res.status(200).json({
        status: 200,
        message: "دوره با موفقیت حذف شد",
      });
    } catch (error) {
      next(error);
    }
  }
  async updateCourseById(req, res, next) {
    try {
      const { courseID } = req.params;
      const course = await CourseModel.findById(courseID);
      if (!course)
        throw createError.NotFound("دوره ای با شناسه ی ارسالی یافت نشد");

      const data = req.body;
      let image;
      if (req.file) {
        const filePath = path.join(req.body.fileUploadPath, req.body.fileName);
        image = filePath.replace(/\\/g, "/");
        data.image = image;
      } else {
        image = "";
      }
      const blackListFields = [
        "likes",
        "dislikes",
        "bookmarks",
        "teacher",
        "_id",
      ];
      Object.keys(data).forEach((key) => {
        if (["", " ", 0, "0", undefined, null, NaN].includes(data[key]))
          delete data[key];
        if (blackListFields.includes(key)) delete data[key];
        if (typeof data[key] === "string") data[key] = data[key].trim();
        if (Array.isArray(data[key]) && data[key].length > 0)
          data[key] = data[key].map((item) => item.trim());
      });
      if (req.body.finleUploadPath && req.body.fileName) {
        deleteFileInPublic(course.image);
      }
      const updateCourseResult = await CourseModel.updateOne(
        { _id: courseID },
        { $set: data }
      );
      if (updateCourseResult.modifiedCount == 0)
        throw createError.InternalServerError("بروز رسانی دوره انجام نشد");
      return res.status(200).json({
        status: 200,
        message: "بروز رسانی با موفقیت انجام شد",
      });
    } catch (error) {
      next(error);
    }
  }
  async getListOfCourse(req, res, next) {
    try {
      const { search } = req.query;
      let courses;
      if (search) {
        courses = await CourseModel.find({
          $text: { $search: search },
        }).populate([
          { path: "category" },
          {
            path: "teacher",
            select: { first_name: 1, last_name: 1, email: 1, mobile: 1 },
          },
        ]);
      } else {
        courses = await CourseModel.find({}).populate([
          { path: "category" },
          {
            path: "teacher",
            select: { first_name: 1, last_name: 1, email: 1, mobile: 1 },
          },
        ]);
      }

      return res.status(200).json({
        status: 200,
        data: {
          courses,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getCourseById(req, res, next) {
    const { id } = req.params;

    const course = await CourseModel.findOne({ _id: id });
    if (!course) throw createError.NotFound("دوره ی مورد نظر یافت نشد");

    return res.status(200).json({
      status: 200,
      data: {
        course,
      },
    });
  }
}

module.exports = {
  CourseController: new CourseController(),
};
