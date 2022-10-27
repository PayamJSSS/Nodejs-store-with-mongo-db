const Application = require("./app/app");
require("dotenv").config();
const PORT = 5000;
const DB_URL = "mongodb://localhost:27017/storeDB";
new Application(PORT, DB_URL);
