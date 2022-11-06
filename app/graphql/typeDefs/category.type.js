const { GraphQLObjectType, GraphQLString, GraphQLList } = require("graphql");
const { PublicCategoryType, AnyType } = require("./public.type");

const CategoryType = new GraphQLObjectType({
  name: "CategoryType",
  fields: {
    title: { type: GraphQLString },
    _id: { type: GraphQLString },
    children: { type: new GraphQLList(AnyType) },
  },
});

const ChildCategoryType = new GraphQLObjectType({
  name: "ChildCategory",
  fields: {
    title: { type: GraphQLString },
    _id: { type: GraphQLString },
    children: { type: new GraphQLList(PublicCategoryType) },
  },
});

module.exports = {
  CategoryType,
  ChildCategoryType,
};
