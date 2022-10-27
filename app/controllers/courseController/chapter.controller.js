const autoBind = require("auto-bind");
const { CourseModel } = require("../../models/course");
const createError = require("http-errors");
class ChapterController {
  constructor() {
    autoBind(this);
  }

  async addChapter(req, res, next) {
    try {
      const { id } = req.params;

      const { title, text } = req.body;
      const course = await this.findCourseById(id);
      const addChapterResult = await CourseModel.updateOne(
        { _id: course._id },
        { $push: { chapter: { title, text } } }
      );
      if (addChapterResult.modifiedCount == 0)
        throw createError.InternalServerError("فصل با  افزوده نشد");
      return res.status(200).json({
        status: 200,
        message: "فصل با موفقیت افزوده شد",
      });
    } catch (error) {
      next(error);
    }
  }
  async getListOfChaptersInCourse(req, res, next) {
    try {
      const { id } = req.params;

      const course = await this.findCourseById(id);
      const chapter = await CourseModel.findOne(
        { _id: course._id },
        { chapter: 1 }
      );
      if (!chapter) throw createError.NotFound("فصل مورد نظر یافت نشد");
      return res.status(200).json({
        status: 200,
        data: { chapter },
      });
    } catch (error) {
      next(error);
    }
  }

  async getOneChapterByIdInChapter(req, res, next) {
    try {
      const { id } = req.params;

      const oneChapter = await CourseModel.findOne(
        { "chapter._id": id },
        { "chapter.$": 1 }
      );

      if (!oneChapter) throw createError.NotFound("فصل مورد نظر یافت نشد");
      return res.status(200).json({
        status: 200,
        data: {
          oneChapter,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async removeChapterById(req, res, next) {
    try {
      const { chapterID } = req.params;

      const chapter = await CourseModel.findOne(
        { "chapter._id": chapterID },
        { "chapter.$": 1 }
      );
      if (!chapter) throw createError.NotFound("فصل مورد نظر یافت نشد");

      const removeResult = await CourseModel.updateOne(
        { "chapter._id": chapterID },
        { $pull: { chapter: { _id: chapterID } } }
      );
      if (removeResult.modifiedCount == 0)
        throw createError.InternalServerError("حذف فصل انجام نشد");
      return res.status(200).json({
        status: 200,
        message: "فصل با موفقیت حذف شد",
      });
    } catch (error) {
      next(error);
    }
  }
  async updateChapterById(req, res, next) {
    try {
      const { chapterID } = req.params;
      const data = req.body;
      const chapter = await CourseModel.findOne(
        { "chapter._id": chapterID },
        { "chapter.$": 1 }
      );
      if (!chapter) throw createError.NotFound("فصل مورد نظر یافت نشد");

      Object.keys(data).forEach((key) => {
        if (["", " ", 0, "0", undefined, null, NaN].includes(data[key]))
          delete data[key];
        if (["_id"].includes(key)) delete data[key];
        if (typeof data[key] === "string") data[key] = data[key].trim();
      });

      const updateChapterResult = await CourseModel.updateOne(
        { "chapter._id": chapterID },
        { $set: { "chapter.$": data } }
      );

      if (updateChapterResult.modifiedCount == 0)
        throw createError.InternalServerError("بروزرسانی انجام نشد");
      return res.status(200).json({
        status: 200,
        message: "بروز رسانی با موفقیت انجام شد",
      });
    } catch (error) {
      next(error);
    }
  }
  async findCourseById(id) {
    const course = await CourseModel.findById(id);
    if (!course)
      throw createError.NotFound("دوره ای با مشخصات ارسالی یافت نشد");
    return course;
  }
}

module.exports = {
  ChapterController: new ChapterController(),
};
