const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLScalarType,
} = require("graphql");
const { PublicCategoryType, AuthorType } = require("./public.type");

const EpisodeType = new GraphQLObjectType({
  name: "EpisodesType",
  fields: {
    title: { type: GraphQLString },
    text: { type: GraphQLString },
    type: { type: GraphQLString },
    time: { type: GraphQLString },
    videoAddres: { type: GraphQLString },
  },
});

const ChapterType = new GraphQLObjectType({
  name: "ChapterType",
  fields: {
    title: { type: GraphQLString },
    text: { type: GraphQLString },
    episodes: { type: new GraphQLList(EpisodeType) },
  },
});

const CourseType = new GraphQLObjectType({
  name: "CourseType",
  fields: {
    _id: { type: GraphQLString },
    teacher: { type: AuthorType },
    title: { type: GraphQLString },
    status: { type: GraphQLString },
    short_text: { type: GraphQLString },
    text: { type: GraphQLString },
    image: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
    category: { type: new GraphQLList(PublicCategoryType) },
    price: { type: GraphQLInt },
    count: { type: GraphQLInt },
    discount: { type: GraphQLInt },
    chapter: { type: new GraphQLList(ChapterType) },
  },
});

module.exports = {
  CourseType,
};
