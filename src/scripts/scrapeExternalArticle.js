const axios = require("axios");
const cheerio = require("cheerio");

const scrapeExternalArticle = async (url) => {
  const { data } = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
  });

  const $ = cheerio.load(data);

  // Remove junk
  $("script, style, nav, footer, header, aside").remove();

  // Try common article containers
  let content = "";

  const selectors = [
    "article",
    ".post-content",
    ".entry-content",
    ".blog-content",
    ".content",
    "main",
  ];

  for (const selector of selectors) {
    if ($(selector).length) {
      $(selector)
        .find("p")
        .each((_, el) => {
          const text = $(el).text().trim();
          if (text.length > 40) {
            content += text + "\n\n";
          }
        });
      if (content.length > 500) break;
    }
  }

  return {
    url,
    content: content.trim(),
  };
};

module.exports = scrapeExternalArticle;

// Test run
if (require.main === module) {
  scrapeExternalArticle(
    "https://www.thinkowl.com/blog/beginners-guide-chatbots/"
  )
    .then(result => {
      console.log("CONTENT LENGTH:", result.content.length);
      console.log(result.content.slice(0, 500));
    })
    .catch(console.error);
}
