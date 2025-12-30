const express = require("express");
const app = express();
const articleRoutes = require("./routes/articleRoutes");
app.use("/api/articles", articleRoutes);
app.use(express.json());

const scrapeRoutes = require("./routes/scrapeRoutes");
app.use("/api", scrapeRoutes);


app.get("/", (req, res) => {
  res.send("BeyondChats API is running");
});

module.exports = app;
