require("dotenv").config();
const app = require("./app");
const http = require("http");

const server = http.createServer(app);
const mongoose = require("./db/connectDB");
const port = process.env.PORT;
server.listen(port, function () {
  console.log("Server running at port " + port);
});
