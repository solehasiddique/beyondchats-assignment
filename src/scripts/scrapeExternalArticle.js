const axios = require("axios");
const cheerio = require("cheerio");


const scrapeExternalArticle = async (url) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
      timeout: 10000, // 10 seconds timeout
    });

    const $ = cheerio.load(data);
    let content = "";
    $("p").each((_, el) => {
      const text = $(el).text().trim();
      if (text) content += text + "\n\n";
    });

    return content || "[No content extracted]";
  } catch (err) {
    console.warn(`Skipping URL (failed to scrape): ${url}`);
    return `[Could not scrape content from ${url}]`;
  }
};

module.exports = scrapeExternalArticle;

// Test run
if (require.main === module) {
  scrapeExternalArticle("https://medium.com/@suraj_bansal/build-your-own-ai-chatbot-a-beginners-guide-to-rag-and-langchain-0189a18ec401")
    .then(console.log)
    .catch(console.error);
}
