const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
} = require("graphql");
const { AuthorType } = require("./public.type");

const CommentAnswerType = new GraphQLObjectType({
  name: "CommentAnswerType",
  fields: {
    _id: { type: GraphQLString },
    user: { type: AuthorType },
    comment: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    show: { type: GraphQLBoolean },
  },
});

const CommentType = new GraphQLObjectType({
  name: "CommentType",
  fields: {
    _id: { type: GraphQLString },
    user: { type: AuthorType },
    content: { type: GraphQLString },
    answer: { type: new GraphQLList(CommentAnswerType) },
    openToComment: { type: GraphQLBoolean },
    show: { type: GraphQLBoolean },
    createdAt: { type: GraphQLString },
  },
});
