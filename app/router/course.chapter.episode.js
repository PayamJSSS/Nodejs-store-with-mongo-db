const {
  EpisodeController,
} = require("../controllers/courseController/episodes.controller");
const { uploadFile } = require("../utils/multer");

const router = require("express").Router();

router.put(
  "/add",
  uploadFile.single("videoAddres"),
  EpisodeController.addEpisode
);
router.get("/list/:chapterID", EpisodeController.getListOfEpisodesByChapterId);
router.get("/:episodeID", EpisodeController.getOneEpisode);

router.patch(
  "/edit/:episodeID",
  uploadFile.single("videoAddres"),
  EpisodeController.updateEpisodeById
);
router.delete("/rmv/:episodeID", EpisodeController.removeEpisodeById);
module.exports = {
  episodeRoutes: router,
};
