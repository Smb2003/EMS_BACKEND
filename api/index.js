const serverless = require("serverless-http");
const app = require("../src/app.js");

console.log(serverless(app));
module.exports.handler  = serverless(app);
