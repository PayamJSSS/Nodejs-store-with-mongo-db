const { ProductController } = require("../controllers/product.controller");
const { verifyLogin } = require("../middelwares/verifyUser");
const { uploadFile } = require("../utils/multer");

const router = require("express").Router();

router.post(
  "/add",
  verifyLogin,
  uploadFile.array("images"),
  ProductController.addProduct
);
router.get("/list", ProductController.getListOfProducts);
router.get("/:id", ProductController.getProductById);
router.delete("/remove/:id", ProductController.removeProduct);
router.patch(
  "/edit/:id",
  uploadFile.array("images", 5),
  ProductController.updateProductById
);
module.exports = {
  productRoutes: router,
};
