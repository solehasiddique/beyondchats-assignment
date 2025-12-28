const axios = require("axios");
const cheerio = require("cheerio");

const scrapeOldestBlogs = async () => {
  const url = "https://beyondchats.com/blogs/";
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const articles = [];

  $(".blog-card").slice(-5).each((_, el) => {
    articles.push({
      title: $(el).find("h2").text().trim(),
      url: $(el).find("a").attr("href"),
    });
  });

  return articles;
};

module.exports = scrapeOldestBlogs;
