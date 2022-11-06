const { graphqlHTTP } = require("express-graphql");
const { authRoutes } = require("./authRoute");
const blogRoute = require("./blogRoute");
const { blogRoutes, blogRouter } = require("./blogRoute");
const { categoryRoutes } = require("./categoryRoute");
const { chapterRoutes } = require("./course.chapter");
const { episodeRoutes } = require("./course.chapter.episode");
const { courseRoutes } = require("./courseRoute");
const { indexRoutes } = require("./indexRoute");
const { productRoutes } = require("./productRoute");
const { graphQLSchema } = require("../graphql/resolvers/index.graphql");
const router = require("express").Router();

router.use("/auth", authRoutes);
router.use("/blogs", blogRouter);
router.use("/index", indexRoutes);
router.use("/category", categoryRoutes);
router.use("/products", productRoutes);
router.use("/course", courseRoutes);
router.use("/chapter", chapterRoutes);
router.use("/episode", episodeRoutes);
router.use(
  "/graphql",
  graphqlHTTP(function (req, res) {
    return {
      schema: graphQLSchema,
      graphiql: true,
      context: { req, res },
    };
  })
);

module.exports = {
  AllRoutes: router,
};
