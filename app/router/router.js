const { authRoutes } = require("./authRoute");
const blogRoute = require("./blogRoute");
const { blogRoutes, blogRouter } = require("./blogRoute");
const { categoryRoutes } = require("./categoryRoute");
const { chapterRoutes } = require("./course.chapter");
const { episodeRoutes } = require("./course.chapter.episode");
const { courseRoutes } = require("./courseRoute");
const { indexRoutes } = require("./indexRoute");
const { productRoutes } = require("./productRoute");

const router = require("express").Router();

router.use("/auth", authRoutes);
router.use("/blogs", blogRouter);
router.use("/index", indexRoutes);
router.use("/category", categoryRoutes);
router.use("/products", productRoutes);
router.use("/course", courseRoutes);
router.use("/chapter", chapterRoutes);
router.use("/episode", episodeRoutes);

module.exports = {
  AllRoutes: router,
};
