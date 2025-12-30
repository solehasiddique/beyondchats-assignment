const express = require("express");
const router = express.Router();
const Article = require("../models/Article");

// GET all articles
router.get("/", async (req, res) => {
  const articles = await Article.find().sort({ createdAt: -1 });
  res.json(articles);
});

// GET one article by ID
router.get("/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) return res.status(404).json({ message: "Article not found" });
  res.json(article);
});

// UPDATE article by ID
router.put("/:id", async (req, res) => {
  const updated = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: "Article not found" });
  res.json(updated);
});

// DELETE article by ID
router.delete("/:id", async (req, res) => {
  const deleted = await Article.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Article not found" });
  res.json({ message: "Article deleted successfully" });
});

module.exports = router;
