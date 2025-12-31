require("dotenv").config();
const fetchArticles = require("./googleSearch"); // your Google Search module
const scrapeExternalArticle = require("./scrapeExternalArticle");
const axios = require("axios");

const ARTICLES_API = "http://localhost:3000/api/articles";

const updateArticle = async (id, newContent) => {
  try {
    const { data } = await axios.put(`${ARTICLES_API}/${id}`, {
      content: newContent,
    });
    return data;
  } catch (err) {
    console.error("Failed to update article:", err.message);
    return null;
  }
};

const runPhase2 = async () => {
  const { data: articles } = await axios.get(ARTICLES_API);

  for (const article of articles) {
    console.log("Processing:", article.title);

    // 1. Search Google for top 2 external articles
    const topLinks = await fetchArticles(article.title);
    console.log("Top external links found:", topLinks);

    // 2. Scrape content from external articles
    const referenceContents = [];
    for (const linkObj of topLinks) {
      if (!linkObj.link) continue;
      const content = await scrapeExternalArticle(linkObj.link);
      referenceContents.push(content);
    }

    // 3. Merge content + references
    const newContent =
      referenceContents.join("\n\n---\n\n") +
      "\n\nReferences:\n" +
      topLinks
        .map((l, i) => `${i + 1}. ${l.link || "[No link]"}`)
        .join("\n");

    // 4. Update original article
    const updated = await updateArticle(article._id, newContent);
    if (updated) console.log("Updated article:", updated.title);
  }
};

if (require.main === module) {
  runPhase2().catch(console.error);
}
