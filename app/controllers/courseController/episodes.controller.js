const autoBind = require("auto-bind");
const { CourseModel } = require("../../models/course");
const createError = require("http-errors");
// const videoDuration = require("get-video-duration");
const path = require("path");
const { default: getVideoDurationInSeconds } = require("get-video-duration");
const { getTime } = require("../../functions/getTime");
class EpisodeController {
  constructor() {
    autoBind(this);
  }
  async addEpisode(req, res, next) {
    try {
      const { title, text, courseID, chapterID } = req.body;

      const course = await CourseModel.findById(courseID);
      if (!course)
        throw createError.NotFound("دوره ای با شناسه ی ارسالی یافت نشد");
      const videoAddres = path
        .join(req.body.fileUploadPath, req.body.fileName)
        .replace(/\\/g, "/");
      const fileURL = videoAddres;
      const videoSeconds = await getVideoDurationInSeconds(fileURL);
      const time = getTime(videoSeconds);

      const addEpisodesResult = await CourseModel.updateOne(
        { _id: courseID, "chapter._id": chapterID },
        {
          $push: {
            "chapter.$.episodes": { title, text, time, videoAddres },
          },
        }
      );

      if (addEpisodesResult.modifiedCount == 0)
        throw createError.InternalServerError("اپیزود اضافه نشد");
      return res.status(200).json({
        status: 200,
        message: "اپیزود با موفقیت افزوده شد",
      });
    } catch (error) {
      next(error);
    }
  }
  async removeEpisodeById(req, res, next) {
    try {
      const { episodeID } = req.params;
      const episode = await this.getEpisodeById(episodeID);
      if (!episode)
        throw createError.NotFound("ابیزودی با شناسه ی ارسالی یافت نشد");
      const removeEpisodeResult = await CourseModel.updateOne(
        { "chapter.episodes._id": episodeID },
        { $pull: { "chapter.$.episodes": { _id: episodeID } } }
      );
      if (removeEpisodeResult.modifiedCount == 0)
        throw createError.InternalServerError("ابیزود مورد نظر حذف نشد");
      return res.status(200).json({
        status: 200,
        message: "ابیزود با موفقیت حذف شد",
      });
    } catch (error) {
      next(error);
    }
  }
  async getOneEpisode(req, res, next) {
    try {
      const { episodeID } = req.params;

      const episode = await CourseModel.findOne(
        {
          "chapter.episodes._id": episodeID,
        },
        { "chapter.episodes.$": 1 }
      );
      const singleEpisode = episode?.chapter?.[0].episodes.filter(
        (item) => item._id == episodeID
      );
      console.log(singleEpisode);
      if (!episode) throw createError.NotFound("ابیزود یافت نشد");
      return res.status(200).json({
        status: 200,
        singleEpisode,
      });
    } catch (error) {
      next(error);
    }
  }
  async getListOfEpisodesByChapterId(req, res, next) {
    try {
      const { chapterID } = req.params;

      const episodes = await CourseModel.findOne(
        { "chapter._id": chapterID },
        { "chapter.episodes.$": 1 }
      );
      if (!episodes) throw createError.NotFound("ابیزودی یافت نشد");
      return res.status(200).json({
        status: 200,
        episodes,
      });
    } catch (error) {
      next(error);
    }
  }
  async updateEpisodeById(req, res, next) {
    try {
      const { episodeID } = req.params;
      const blackListFields = ["_id"];
      const data = req.body;
      const episode = await this.getEpisodeById(episodeID);
      console.log(episode);
      if (!episode)
        throw createError.NotFound("ابیزودی با شناسه ی ارسالی یافت نشد");
      if (req.file) {
        const videoAddres = path
          .join(req.body.fileUploadPath, req.body.fileName)
          .replace(/\\/g, "/");
        const fileURL = videoAddres;
        const videoSeconds = await getVideoDurationInSeconds(fileURL);
        const time = getTime(videoSeconds);
        blackListFields.push("fileUploadPath");
        blackListFields.push("fileName");
        data.videoAddres = videoAddres;
        data.time = time;
      } else {
        blackListFields.push("videoAddres");
        blackListFields.push("time");
      }
      Object.keys(data).forEach((key) => {
        if (["", " ", 0, "0", undefined, null, NaN].includes(data[key]))
          delete data[key];
        if (blackListFields.includes(key)) delete data[key];
        if (typeof data[key] === "string") data[key] = data[key].trim();
      });
      const newEpisode = {
        ...episode,
        ...data,
      };
      const editEpisodeResult = await CourseModel.updateOne(
        { "chapter.episodes._id": episodeID },
        { $set: { "chapter.$.episodes": newEpisode } }
      );
      if (editEpisodeResult.modifiedCount == 0)
        throw createError.InternalServerError("بروز رسانی ابیزود انجام نشد");
      return res.status(200).json({
        status: 200,
        message: "بروز رسانی ابیزود با موفقیت انجام شد",
      });
    } catch (error) {
      next(error);
    }
  }
  async getEpisodeById(episodeId) {
    const episode = await CourseModel.findOne(
      {
        "chapter.episodes._id": episodeId,
      },
      { "chapter.episodes.$": 1 }
    );
    const singleEpisode = episode?.chapter?.[0].episodes.filter(
      (item) => item._id == episodeId
    );
    return JSON.parse(JSON.stringify(singleEpisode[0]));
  }
}

module.exports = {
  EpisodeController: new EpisodeController(),
};
