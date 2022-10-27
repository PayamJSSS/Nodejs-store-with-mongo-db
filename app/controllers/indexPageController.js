class IndexPage {
  indexPage(req, res, next) {
    return res.send("وارد حساب کاربری شدید");
  }
}

module.exports = {
  IndexPage: new IndexPage(),
};
