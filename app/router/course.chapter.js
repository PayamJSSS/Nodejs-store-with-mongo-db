const {
  ChapterController,
} = require("../controllers/courseController/chapter.controller");

const router = require("express").Router();

router.put("/add/:id", ChapterController.addChapter);
router.get("/list/:id", ChapterController.getListOfChaptersInCourse);
router.get("/:id", ChapterController.getOneChapterByIdInChapter);
router.put("/remove/:chapterID", ChapterController.removeChapterById);
router.patch("/edit/:chapterID", ChapterController.updateChapterById);
module.exports = {
  chapterRoutes: router,
};
