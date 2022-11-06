const { GraphQLList, GraphQLString } = require("graphql");
const { categoryModel } = require("../../models/category");
const {
  CategoryType,
  ChildCategoryType,
} = require("../typeDefs/category.type");

const CategoeyResolver = {
  type: new GraphQLList(CategoryType),

  resolve: async () => {
    return await categoryModel.find({ parent: undefined });
  },
};

const CategoryWithChildResolver = {
  type: new GraphQLList(ChildCategoryType),
  args: {
    parent: { type: GraphQLString },
  },
  resolve: async (_, args, context) => {
    const { parent } = args;
    return await categoryModel.find({ parent }).populate([{ path: "parent" }]);
  },
};
module.exports = {
  CategoeyResolver,
  CategoryWithChildResolver,
};
