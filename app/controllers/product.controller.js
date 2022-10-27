const autoBind = require("auto-bind");
const { listOfImages } = require("../functions/getListOfImages");
const { productModel } = require("../models/product");
const createError = require("http-errors");
const { deleteFileInPublic } = require("../functions/deleteFileInPublic");
class ProductController {
  constructor() {
    autoBind(this);
  }

  async addProduct(req, res, next) {
    try {
      const {
        title,
        text,
        short_text,
        tags,
        category,
        price,
        count,
        width,
        length,
        height,
        weight,
      } = req.body;

      //required fields images,type,supplier,features
      const supplier = req.user._id;
      const images = listOfImages(req);

      let features = {};
      let type;
      if (!isNaN(width) || !isNaN(height) || !isNaN(weight) || !isNaN(length)) {
        features.width = width;
        features.height = height;
        features.weight = weight;
        features.length = length;
        type = "phisycal";
      } else {
        type = "virtuals";
      }
      if (!width) {
        features.width = 0;
      }
      if (!height) features.height = 0;
      if (!weight) features.weight = 0;
      if (!length) features.length = 0;

      const product = await productModel.create({
        title,
        text,
        short_text,
        tags,
        category,
        price,
        count,
        images,
        features,
        type,
        supplier,
      });
      return res.status(200).json({
        status: 200,
        product,
      });
    } catch (error) {
      console.log(req.body.fileName);
      deleteFileInPublic(req.body.fileName);
      next(error);
    }
  }

  async getProductById(req, res, next) {
    const { id } = req.params;

    const product = await this.findProductById(id);
    return res.status(200).json({
      status: 200,
      product,
    });
  }
  async getListOfProducts(req, res, next) {
    const products = await productModel.find({});
    return res.status(200).json({
      status: 200,
      products,
    });
  }
  async removeProduct(req, res, next) {
    const { id } = req.params;
    const product = await this.findProductById(id);

    const removeResult = await productModel.deleteOne({ _id: product._id });

    if (removeResult.deletedCount == 0)
      throw createError.InternalServerError("محصول مورد نظر حذف نشد");
    return res.status(200).json({
      status: 200,
      message: "محصول مورد نظر با موفقیت حذف شد",
    });
  }

  async updateProductById(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;
      const product = await this.findProductById(id);
      if (req.files || req.file) data.images = listOfImages(req);
      Object.keys(data).forEach((key) => {
        if (["", " ", 0, undefined, null, "0", NaN].includes(data[key]))
          delete data[key];
        if (["likes", "dislikes", "supplier", "category"].includes(key))
          delete data[key];
        if (typeof data[key] == "string") data[key].trim();
        if (Array.isArray(data[key]) && data[key].length == 0) delete data[key];
        if (Array.isArray(data[key]) && data[key].length > 0) {
          data[key] = data[key].map((item) => item.trim());
        }
      });

      const updateResult = await productModel.updateOne(
        { _id: product._id },
        { $set: data }
      );
      if (updateResult.modifiedCount == 0)
        throw createError.InternalServerError("بروز رسانی انجام نشد");

      return res.status(200).json({
        status: 200,
        message: "بروز رسانی با موفقیت انجام شد",
      });
    } catch (error) {
      deleteFileInPublic(req.body.fileName);

      next(error);
    }
  }

  async findProductById(id) {
    const product = await productModel.findById(id);

    if (!product) throw createError.NotFound("محصول مورد نظر یافت نشد");
    return product;
  }
}

module.exports = {
  ProductController: new ProductController(),
};
