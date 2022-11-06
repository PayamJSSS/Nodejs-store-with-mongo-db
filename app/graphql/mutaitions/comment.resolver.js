const { GraphQLString } = require("graphql");
const { blogModel } = require("../../models/blogs");
const { ResponseType } = require("../typeDefs/public.type");
const createError = require("http-errors");
const { verifyAccessTokenInGraphQL } = require("../graphUtils");
const { default: mongoose } = require("mongoose");

const BlogCommentResolver = {
  type: ResponseType,
  args: {
    content: { type: GraphQLString },
    blogID: { type: GraphQLString },
    responseTo: { type: GraphQLString },
  },
  resolve: async (_, args, context) => {
    const { req } = context;
    const { blogID, content, responseTo } = args;
    const user = await verifyAccessTokenInGraphQL(req);
    const blog = await blogModel.findById(blogID);
    if (!blog) throw createError.NotFound("بلاگی با شناسه ی ارسالی یافت نشد");

    if (!responseTo) {
      const createCommentOnBlog = await blogModel.updateOne(
        { _id: blogID },
        {
          $push: {
            comments: {
              content,
              user: user._id,
              openToComment: true,
              show: false,
            },
          },
        }
      );
      if (createCommentOnBlog.modifiedCount == 0)
        throw createError.InternalServerError("ثبت نظر انجام نشد");
      return {
        statusCode: 200,
        data: {
          message:
            "ثبت نظر با موفقیت انجام شد بس از تایید در وب سایت قرار میگیرد",
        },
      };
    }
    if (responseTo && mongoose.isValidObjectId(responseTo)) {
      const responsedComment = await getComment(blogModel, responseTo);
      if (responsedComment.openToComment) {
        const responseCommentResult = await blogModel.updateOne(
          { "comments._id": responseTo },
          {
            $push: {
              "comments.$.answers": {
                openToComment: false,
                content,
                show: false,
                user: user._id,
              },
            },
          }
        );
        if (responseCommentResult.modifiedCount == 0)
          throw createError.InternalServerError("ثبت باسخ انجام نشد");
        return {
          statusCode: 200,
          data: {
            message:
              "ثبت نظر با موفقیت انجام شد بس از تایید در وب سایت قرار میگیرد",
          },
        };
      }
    }
  },
};

const getComment = async (model, id) => {
  const comment = await model.findOne(
    { "comments._id": id },
    { "comments.$": 1 }
  );
  if (!comment) throw createError.NotFound("نظری با این مشخصات یافت نشد");
  const copiedObject = JSON.parse(JSON.stringify(comment));
  return copiedObject?.comments?.[0];
};

module.exports = {
  BlogCommentResolver,
};
