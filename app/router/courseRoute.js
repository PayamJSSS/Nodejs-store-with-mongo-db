const {
  CourseController,
} = require("../controllers/courseController/course.controller");
const { verifyLogin } = require("../middelwares/verifyUser");
const { uploadFile } = require("../utils/multer");

const router = require("express").Router();

router.post(
  "/add",
  verifyLogin,
  uploadFile.single("image"),
  CourseController.addCourse
);
router.patch(
  "/edit/:courseID",
  verifyLogin,
  uploadFile.single("image"),
  CourseController.updateCourseById
);
router.delete("/remove/:courseID", CourseController.removeCourseById);
router.get("/list", CourseController.getListOfCourse);
router.get("/:id", CourseController.getCourseById);
module.exports = {
  courseRoutes: router,
};
