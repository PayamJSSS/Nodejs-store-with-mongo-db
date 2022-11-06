const { GraphQLObjectType, GraphQLString, GraphQLList } = require("graphql");
const { AuthorType, PublicCategoryType } = require("./public.type");

const BlogType = new GraphQLObjectType({
  name: "BlogType",
  fields: {
    _id: { type: GraphQLString },
    author: { type: AuthorType },
    title: { type: GraphQLString },
    short_text: { type: GraphQLString },
    image: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
    category: { type: new GraphQLList(PublicCategoryType) },
    likes: { type: new GraphQLList(AuthorType) },
    dislikes: { type: new GraphQLList(AuthorType) },
  },
});

module.exports = {
  BlogType,
};
