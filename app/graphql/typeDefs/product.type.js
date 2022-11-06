const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
  GraphQLInt,
} = require("graphql");
const {
  CategoryType,
  AuthorType,
  PublicCategoryType,
} = require("./public.type");
const FeaturesType = new GraphQLObjectType({
  name: "FeaturesType",
  fields: {
    length: { type: GraphQLString },
    height: { type: GraphQLString },
    weight: { type: GraphQLString },
    width: { type: GraphQLString },
  },
});
const ProductType = new GraphQLObjectType({
  name: "ProductType",
  fields: {
    _id: { type: GraphQLString },
    supplier: { type: AuthorType },
    title: { type: GraphQLString },
    short_text: { type: GraphQLString },
    text: { type: GraphQLString },
    images: { type: new GraphQLList(GraphQLString) },
    tags: { type: new GraphQLList(GraphQLString) },
    category: { type: new GraphQLList(PublicCategoryType) },
    price: { type: GraphQLInt },
    count: { type: GraphQLInt },
    discount: { type: GraphQLInt },
    features: { type: FeaturesType },
  },
});

module.exports = {
  ProductType,
};
