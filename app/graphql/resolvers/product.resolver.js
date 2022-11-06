const { GraphQLObjectType, GraphQLList, GraphQLString } = require("graphql");
const { productModel } = require("../../models/product");
const { ProductType } = require("../typeDefs/product.type");

const ProductResolver = {
  type: new GraphQLList(ProductType),
  args: {
    category: { type: GraphQLString },
  },
  resolve: async (_, args) => {
    const { category } = args;
    const findQuery = category ? { category } : {};
    return await productModel
      .find({})
      .populate([{ path: "supplier" }, { path: "category" }]);
  },
};

module.exports = {
  ProductResolver,
};
