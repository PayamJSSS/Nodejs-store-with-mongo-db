const { GraphQLString } = require("graphql");
const { blogModel } = require("../../models/blogs");
const { verifyAccessTokenInGraphQL } = require("../graphUtils");
const { ResponseType } = require("../typeDefs/public.type");
const createError = require("http-errors");

const BlogsLikeResolver = {
  type: ResponseType,
  args: {
    blogId: { type: GraphQLString },
  },
  resolve: async (_, args, context) => {
    const { blogId } = args;
    const { req } = context;
    const user = await verifyAccessTokenInGraphQL(req);
    const blog = await blogModel.findById(blogId);

    if (!blog) throw createError.NotFound("بلاگی با شناسه ارسالی یافت نشد");
    const likeQuery = blog.likes.includes(user._id)
      ? { $pull: { likes: user._id } }
      : { $push: { likes: user._id } };
    const blogLikeResult = await blogModel.updateOne(
      { _id: blogId },
      likeQuery
    );

    if (!blog.likes.includes(user._id)) {
      removeUserFromDislike = await blogModel.updateOne(
        { _id: blogId },
        { $pull: { dislikes: user._id } }
      );
    }
    let message;
    if (blog.likes.includes(user._id)) {
      message = "بلاگ با موفقیت لایک شد";
    } else {
      message = "بلاگ با موفقیت انلایک شد";
    }
    return {
      statusCode: 200,
      data: {
        message,
      },
    };
  },
};

const DislikeBlogResolver = {
  type: ResponseType,
  args: {
    blogId: { type: GraphQLString },
  },
  resolve: async (_, args, context) => {
    const { blogId } = args;
    const { req } = context;
    const user = await verifyAccessTokenInGraphQL(req);
    const blog = await blogModel.findById(blogId);

    if (!blog) throw createError.NotFound("بلاگی با شناسه ارسالی یافت نشد");

    const dislikeQuery = blog.dislikes.includes(user._id)
      ? { $pull: { dislikes: user._id } }
      : { $push: { dislikes: user._id } };

    const dislikeBlogResult = await blogModel.updateOne(
      { _id: blogId },
      dislikeQuery
    );
    if (!blog.dislikes.includes(user._id)) {
      removeLikeResult = await blogModel.updateOne(
        { _id: blogId },
        { $pull: { likes: user._id } }
      );
    }
    let message;
    if (blog.dislikes.includes(user._id)) {
      message = "بلاگ با موفقیت دیسلایک شد";
    } else {
      message = "دیس لایک حذف شد";
    }

    return {
      statusCode: 200,
      data: {
        message,
      },
    };
  },
};

module.exports = {
  BlogsLikeResolver,
  DislikeBlogResolver,
};
