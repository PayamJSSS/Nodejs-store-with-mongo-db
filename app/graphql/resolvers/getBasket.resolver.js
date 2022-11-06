const { userModel } = require("../../models/user");
const { verifyAccessTokenInGraphQL } = require("../graphUtils");
const { AnyType } = require("../typeDefs/public.type");

const getUserBasketResolver = {
  type: AnyType,

  resolve: async (_, args, context) => {
    const { req } = context;
    const user = await verifyAccessTokenInGraphQL(req);
    console.log(user);
    const userBasketDetail = await userModel.aggregate([
      { $match: { _id: user._id } },
      {
        $project: {
          basket: 1,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "basket.product.productID",
          foreignField: "_id",
          as: "userBasketDetail",
        },
      },
      {
        $addFields: {
          total: {
            $function: {
              body: function (products, userbasket) {
                return userbasket.map((product) => {
                  const count = products.find(
                    (item) => item.productID.valueOf() == product._id.valueOf()
                  ).count;
                  const priceProduct = count * product.price;
                  return {
                    ...product,
                    priceProduct,
                    finalyPrice:
                      priceProduct - (product.discount / 100) * priceProduct,
                  };
                });
              },
              args: ["$basket.product", "$userBasketDetail"],
              lang: "js",
            },
          },
        },
      },
      {
        $addFields: {
          paymentBasket: {
            $function: {
              body: function (productBasket, productsDetail) {
                const productAmount = productsDetail.reduce(
                  (total, product) => {
                    const productCount = productBasket.find(
                      (item) => item.productID.valueOf() == product._id
                    ).count;
                    const productPrice = productCount * product.price;
                    const productPriceWithDiscount =
                      productPrice - (product.discount / 100) * productPrice;

                    return total + productPriceWithDiscount;
                  },
                  0
                );
                const productIDs = productsDetail.map((item) =>
                  item._id.valueOf()
                );
                return {
                  productAmount,
                  productIDs,
                };
              },
              args: ["$basket.product", "$userBasketDetail"],
              lang: "js",
            },
          },
        },
      },
    ]);

    return userBasketDetail;
  },
};

module.exports = {
  getUserBasketResolver,
};
