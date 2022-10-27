const express = require("express");
const { default: mongoose } = require("mongoose");
const path = require("path");
const { AllRoutes } = require("./router/router");
class Application {
  #app = express();
  #PORT;
  #DB_URL;
  constructor(PORT, DB_URL) {
    this.#PORT = PORT;
    this.#DB_URL = DB_URL;
    this.connectToDB();
    this.configApplication();
    this.createServer();
    this.createRoutes();
    this.errorHandling();
  }
  configApplication() {
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: true }));
    this.#app.use(express.static(path.join(__dirname, "..", "public")));
  }
  createServer() {
    const http = require("http");
    const server = http.createServer(this.#app);
    server.listen(this.#PORT, (err) => {
      if (!err) console.log(`server connect on http://localhost:${this.#PORT}`);
    });
  }
  connectToDB() {
    mongoose.connect(this.#DB_URL, (err) => {
      if (err) console.log("failed to connected to DB");
      return console.log(" connected to DB");
    });
  }
  createRoutes() {
    this.#app.use(AllRoutes);
  }
  errorHandling() {
    this.#app.use((req, res, next) => {
      return res.status(404).json({
        status: 404,
        message: "ادرس مورد نظر یافت نشد",
      });
    });
    this.#app.use((error, req, res, next) => {
      const status = error.status || 500;
      const message = error.message || "Internal Server Error";
      return res.status(status).json({
        status: status,
        message: message,
      });
    });
  }
}

module.exports = Application;
