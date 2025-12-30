const express = require("express");
const router = express.Router();
const scrapeOldestBlogs = require("../services/scrapeBlogs");
const Article = require("../models/Article");

router.post("/scrape", async (req, res) => {
  try {
    const blogs = await scrapeOldestBlogs();

    if (!blogs || blogs.length === 0) {
      return res.status(400).json({ message: "No blogs found to scrape" });
    }

    const savedArticles = [];

    for (const blog of blogs) {
      // Upsert by URL
      const updatedOrCreated = await Article.findOneAndUpdate(
        { url: blog.url }, // search by URL
        { $setOnInsert: blog }, // only insert if not existing
        { new: true, upsert: true } // create if not exist
      );
      savedArticles.push(updatedOrCreated);
    }

    res.status(201).json(savedArticles);
  } catch (error) {
    console.error("Scraping error:", error);
    res.status(500).json({ message: "Scraping failed" });
  }
});

module.exports = router;
