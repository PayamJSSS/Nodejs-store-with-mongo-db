const { GraphQLList, GraphQLString } = require("graphql");
const { blogModel } = require("../../models/blogs");
const { verifyAccessTokenInGraphQL } = require("../graphUtils");
const { BlogType } = require("../typeDefs/blog.type");

const BlogResolver = {
  type: new GraphQLList(BlogType),
  args: {
    category: { type: GraphQLString },
  },

  resolve: async (_, args, context) => {
    const { category } = args;
    const findQuery = category ? { category } : {};
    return await blogModel
      .find(findQuery)
      .populate([{ path: "category" }, { path: "author" }]);
  },
};

module.exports = {
  BlogResolver,
};
