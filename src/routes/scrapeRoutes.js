const express = require("express");
const router = express.Router();
const scrapeOldestBlogs = require("../services/scrapeBlogs");
const Article = require("../models/Article");

router.post("/scrape", async (req, res) => {
  try {
    console.log("POST /api/scrape called");

    const blogs = await scrapeOldestBlogs();

    if (!blogs || blogs.length === 0) {
      return res.status(400).json({ message: "No blogs found to scrape" });
    }

    const existing = await Article.countDocuments();
    if (existing > 0) {
      return res.status(400).json({ message: "Articles already scraped" });
    }

    const saved = await Article.insertMany(blogs);
    res.status(201).json(saved);
  } catch (error) {
    console.error("Scraping error:", error);
    res.status(500).json({ message: "Scraping failed" });
  }
});

module.exports = router;
