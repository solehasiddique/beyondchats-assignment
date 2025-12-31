require("dotenv").config();
const fetchArticles = require("./googleSearch"); // Google Search module
const scrapeExternalArticle = require("./scrapeExternalArticle");
const axios = require("axios");
const OpenAI = require("openai");

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Your local articles API
const ARTICLES_API = "http://localhost:3000/api/articles";

// Function to update an article
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

// LLM merge function using new OpenAI SDK
const mergeArticlesWithLLM = async (contents, originalTitle) => {
  const prompt = `
You are an expert content writer. 
You have the following text segments from multiple articles about "${originalTitle}":
${contents.map((c, i) => `Segment ${i + 1}: ${c}`).join("\n\n")}

Please merge them into one coherent, informative article. 
Preserve the key ideas, keep the text clear, concise, and readable, and make sure it reads as a single piece.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1500,
  });

  return response.choices[0].message.content.trim();
};

// Main phase 2 function
const runPhase2 = async () => {
  try {
    const { data: articles } = await axios.get(ARTICLES_API);

    for (const article of articles) {
      try {
        console.log("Processing:", article.title);

        // 1. Search Google for top 2 external articles
        const topLinks = await fetchArticles(article.title);
        console.log("Top external links found:", topLinks);

        // 2. Scrape content from external articles
        const referenceContents = [];
        for (const linkObj of topLinks) {
          if (!linkObj.link) continue;
          try {
            const content = await scrapeExternalArticle(linkObj.link);
            if (content && content.length > 0) {
              referenceContents.push(content);
            } else {
              console.log(`Skipping URL (failed to scrape): ${linkObj.link}`);
            }
          } catch (err) {
            console.log(`Skipping URL (error scraping): ${linkObj.link}`);
          }
        }

        // 3. Merge scraped content with LLM
        let mergedContent = "";

if (referenceContents.length > 0) {
  try {
    mergedContent = await mergeArticlesWithLLM(
      referenceContents,
      article.title
    );
  } catch (err) {
    console.warn("LLM failed, falling back to scraped content");

    mergedContent = referenceContents
      .slice(0, 2)
      .join("\n\n---\n\n");
  }
} else {
  console.log("No external content to merge for this article.");
}

        // 4. Append references
        const newContent =
          mergedContent +
          "\n\nReferences:\n" +
          topLinks.map((l, i) => `${i + 1}. ${l.link}`).join("\n");

        // 5. Update the article
        const updated = await updateArticle(article._id, newContent);
        if (updated) console.log("Updated article:", updated.title);
      } catch (err) {
        console.error(
          `Failed processing article "${article.title}":`,
          err.message
        );
      }
    }
  } catch (err) {
    console.error("Failed fetching articles:", err.message);
  }
};

// Run the script
if (require.main === module) {
  runPhase2().catch(console.error);
}
