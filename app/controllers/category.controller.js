const autoBind = require("auto-bind");
const { categoryModel } = require("../models/category");
const { categorySchema } = require("../validations/categoryValidation");
const createError = require("http-errors");

class CategoryController {
  constructor() {
    autoBind(this);
  }

  async addCategory(req, res, next) {
    try {
      const { title, parent } = req.body;
      //   await categorySchema.validateAsync(req.body);
      const category = await categoryModel.create({
        title,
        parent,
      });
      return res.status(200).json({
        status: 200,
        category,
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllCategoryWithAggregateDepthOne(req, res, next) {
    try {
      const allCategory = await categoryModel.aggregate([
        {
          $match: {},
        },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "parent",
            as: "children",
          },
        },
      ]);
      return res.status(200).json({
        status: 200,
        allCategory,
      });
    } catch (error) {
      next(error);
    }
  }
  async getCategoryById(req, res, next) {
    try {
      const { id } = req.params;

      const singleCategory = await categoryModel.findOne({ _id: id });
      if (!singleCategory)
        throw createError.NotFound("دسته بندی مورد نظر یافت نشد");
      return res.status(200).json({
        status: 200,
        singleCategory,
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllCategoryWithPopulate(req, res, next) {
    try {
      const allCategoryListPopulate = await categoryModel.find({});
      return res.status(200).json({
        status: 200,
        allCategoryListPopulate,
      });
    } catch (error) {
      next(error);
    }
  }
  async getCategoryByIdWithPopulate(req, res, next) {
    try {
      const { id } = req.params;

      const singleCategoryWithPop = await categoryModel.findOne({ _id: id });
      if (!singleCategoryWithPop)
        throw createError.NotFound("  دسته بندی مورد نظر یافت نشد ");
      return res.status(200).json({
        status: 200,
        singleCategoryWithPop,
      });
    } catch (error) {
      next(error);
    }
  }
  async editCategoryById(req, res, next) {
    try {
      const { id } = req.params;
      const { title } = req.body;
      const editCategoryResult = await categoryModel.updateOne(
        { _id: id },
        { $set: { title } }
      );
      if (editCategoryResult.modifiedCount == 0)
        throw createError.InternalServerError("بروز رسانی انجام نشد");
      return res.status(200).json({
        status: 200,
        message: "بروز رسانی موفقیت امیز بود",
      });
    } catch (error) {
      next(error);
    }
  }
  async removeCategoryById(req, res, next) {
    try {
      const { id } = req.params;
      const category = await categoryModel.findById(id);
      if (!category) throw createError.NotFound("دسته بندی مورد نظر یافت نشد");
      const deleteCategoryResult = await categoryModel.deleteMany({ _id: id });
      if (deleteCategoryResult.deletedCount == 0)
        throw createError.InternalServerError("حذف دسته بندی انجام نشد");
      return res.status(200).json({
        status: 200,
        message: "حذف دسته بندی موفقیت امیز بود",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  CategoryController: new CategoryController(),
};
