const axios = require("axios");
const cheerio = require("cheerio");

const BLOG_URLS = [
  "https://beyondchats.com/blogs/introduction-to-chatbots/",
  "https://beyondchats.com/blogs/live-chatbot/",
  "https://beyondchats.com/blogs/virtual-assistant/",
  "https://beyondchats.com/blogs/lead-generation-chatbots/",
  "https://beyondchats.com/blogs/chatbots-for-small-business-growth/",
];


const scrapeOldestBlogs = async () => {
  const articles = [];

  for (const url of BLOG_URLS) {
    
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const title = $("h1").first().text().trim();

  let content = "";
  $(".blog-content p").each((_, el) => {
    content += $(el).text().trim() + "\n\n";
  });

  articles.push({
    title,
    content,
    url,
  });
}
  return articles;
};


module.exports = scrapeOldestBlogs;
