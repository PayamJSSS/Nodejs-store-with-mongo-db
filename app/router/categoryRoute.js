const { CategoryController } = require("../controllers/category.controller");

const router = require("express").Router();

router.post("/add", CategoryController.addCategory);
router.get("/pop/list", CategoryController.getAllCategoryWithPopulate);
router.get("/pop/:id", CategoryController.getCategoryByIdWithPopulate);
router.get("/list", CategoryController.getAllCategoryWithAggregateDepthOne);
router.get("/:id", CategoryController.getCategoryById);
router.patch("/edit/:id", CategoryController.editCategoryById);
router.delete("/delete/:id", CategoryController.removeCategoryById);

module.exports = {
  categoryRoutes: router,
};
