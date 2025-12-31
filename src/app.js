const express = require("express");
const cors = require("cors");

const app = express();

/* 🔥 CORS MUST COME FIRST */
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());

/* Routes */
const articleRoutes = require("./routes/articleRoutes");
app.use("/api/articles", articleRoutes);

const scrapeRoutes = require("./routes/scrapeRoutes");
app.use("/api", scrapeRoutes);

app.get("/", (req, res) => {
  res.send("BeyondChats API is running");
});

module.exports = app;
