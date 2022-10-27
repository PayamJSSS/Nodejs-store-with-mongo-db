const { IndexPage } = require("../controllers/indexPageController");
const { verifyLogin } = require("../middelwares/verifyUser");

const router = require("express").Router();

router.get("/", verifyLogin, IndexPage.indexPage);

module.exports = {
  indexRoutes: router,
};
