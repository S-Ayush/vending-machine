const dotenv = require("dotenv");
const express = require("express");
var cors = require("cors");
const app = express();
const routes = require("./src/routes");
const cookieParser = require("cookie-parser");
const path = require("path");

//allow cors origin
app.use(
  cors({
    credentials: true,
    origin: "*"
  })
);

dotenv.config({ path: "./config.env" });
const PORT = process.env.PORT || 3000;

//for getting json body from client
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "frontend-build", "build")));


//database connection
require("./src/config/db.config");

// just for testing purpose
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend-build', 'build', 'index.html'))
});

//routes starts from here
app.use(routes);

//listening on specific port
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

module.exports = app;
