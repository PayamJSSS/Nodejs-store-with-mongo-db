const { BlogController } = require("../controllers/blog.controller");
const { verifyLogin } = require("../middelwares/verifyUser");

const router = require("express").Router();
router.post("/createBlog", verifyLogin, BlogController.createBlog);
router.get("/list", BlogController.getListOfBlogs);
router.get("/:id", BlogController.getOneBlogById);
router.patch("/edit/:id", BlogController.updateBlogById);

module.exports = {
  blogRouter: router,
};
