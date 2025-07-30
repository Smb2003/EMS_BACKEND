const serverless = require("serverless-http");
const app = require("../src/app.js");

module.exports  = serverless(app);
