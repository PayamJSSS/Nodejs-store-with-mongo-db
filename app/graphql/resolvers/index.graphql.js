const { GraphQLObjectType, GraphQLSchema, GraphQLList } = require("graphql");
const { BlogType } = require("../typeDefs/blog.type");
const { BlogResolver } = require("./blog.resolver");
const {
  BlogsLikeResolver,
  DislikeBlogResolver,
} = require("../mutaitions/likes.resolver");
const {
  CategoeyResolver,
  CategoryWithChildResolver,
} = require("./category.resolver");
const { CourseResolver } = require("./course.resolver");
const { ProductResolver } = require("./product.resolver");
const { BlogCommentResolver } = require("../mutaitions/comment.resolver");
const {
  AddProductToBasketResolver,
  removeProductInBasketResolver,
} = require("../mutaitions/basket.resolver");
const { getUserBasketResolver } = require("./getBasket.resolver");

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    blogs: BlogResolver,
    products: ProductResolver,
    categories: CategoeyResolver,
    childCategory: CategoryWithChildResolver,
    courses: CourseResolver,
    basket: getUserBasketResolver,
  },
});
const RootMutation = new GraphQLObjectType({
  name: "Mutaition",
  fields: {
    BlogCommentResolver,
    BlogsLikeResolver,
    DislikeBlogResolver,
    AddProductToBasketResolver,
    removeProductInBasketResolver,
  },
});

const graphQLSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

module.exports = {
  graphQLSchema,
};
