const express = require("express");

const app = express();
const port = process.env.PORT || 8000;

app.use(express.static("public"));

const server = require("http").createServer(app);

app.use("/scripts", express.static("${__dirname}/node_modules/"));

server.listen(port, () => {
  console.log("listening on %d", port);
});
