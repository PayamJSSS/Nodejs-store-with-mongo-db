const { GraphQLList, GraphQLString } = require("graphql");
const { CourseModel } = require("../../models/course");
const { CourseType } = require("../typeDefs/course.type");

const CourseResolver = {
  type: new GraphQLList(CourseType),
  args: {
    category: { type: GraphQLString },
  },
  resolve: async (_, args) => {
    const { category } = args;
    const findQuery = category ? { category } : {};
    const course = await CourseModel.find(findQuery);
    return course;
  },
};

module.exports = {
  CourseResolver,
};
