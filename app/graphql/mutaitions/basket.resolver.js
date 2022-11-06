const { productModel } = require("../../models/product");
const { ResponseType } = require("../typeDefs/public.type");
const createError = require("http-errors");
const { userModel } = require("../../models/user");
const { verifyAccessTokenInGraphQL } = require("../graphUtils");
const { GraphQLString } = require("graphql");
const AddProductToBasketResolver = {
  type: ResponseType,
  args: {
    productID: { type: GraphQLString },
  },
  resolve: async (_, args, context) => {
    const { req } = context;
    const { productID } = args;
    const product = await productModel.findById(productID);
    if (!product) throw createError.NotFound("محصول مورد نظر یافت نشد");

    const user = await verifyAccessTokenInGraphQL(req);
    const productInBasket = await checkExistProductInBasket(
      productID,
      user._id
    );
    console.log(productInBasket);
    let message;
    if (!productInBasket) {
      const addProductInBasket = await userModel.updateOne(
        { _id: user._id },
        {
          $push: {
            "basket.product": { productID, count: 1 },
          },
        }
      );
      message = "محصول مورد نظر اضافه شد";
    }
    if (productInBasket) {
      const incrementProductInBasket = await userModel.updateOne(
        {
          _id: user._id,
          "basket.product.productID": productID,
        },
        { $inc: { "basket.product.$.count": 1 } }
      );
      message = "یک عدد به تعداد محصول مورد نظر اضافه شد";
    }

    return {
      statusCode: 200,
      data: {
        message,
      },
    };
  },
};

const removeProductInBasketResolver = {
  type: ResponseType,
  args: {
    productID: { type: GraphQLString },
  },
  resolve: async (_, args, context) => {
    const { productID } = args;
    const { req } = context;
    const user = await verifyAccessTokenInGraphQL(req);
    const product = await productModel.findById(productID);
    if (!product)
      throw createError.NotFound("محصولی با شناسه ی ارسالی یافت نشد");
    const findedProductInBasket = await checkExistProductInBasket(
      productID,
      user._id
    );

    console.log(findedProductInBasket.count);
    let message;
    if (findedProductInBasket.count > 1) {
      const decreseProductResult = await userModel.updateOne(
        { _id: user._id, "basket.product.productID": productID },
        {
          $inc: { "basket.product.$.count": -1 },
        }
      );
      message = "از محصول مورد نظر یک عدد کم شد";
    }
    if (findedProductInBasket.count == 1) {
      const removeProductResult = await userModel.updateOne(
        { _id: user._id, "basket.product.productID": productID },
        {
          $pull: {
            "basket.product": { productID },
          },
        }
      );
      message = "محصول مورد نظر از سبد خرید حذف شد";
    }

    return {
      statusCode: 200,
      data: {
        message,
      },
    };
  },
};

const checkExistProductInBasket = async (productID, userID) => {
  const findedProduct = await userModel.findOne(
    { _id: userID, "basket.product.productID": productID },
    { "basket.product.$": 1 }
  );
  const cloneFindedProduct = JSON.parse(JSON.stringify(findedProduct));
  return cloneFindedProduct?.basket?.product?.[0];
};

module.exports = {
  AddProductToBasketResolver,
  removeProductInBasketResolver,
};
