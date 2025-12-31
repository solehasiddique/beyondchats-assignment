require("dotenv").config();
const axios = require("axios");

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CX = process.env.GOOGLE_CX;

const searchGoogle = async (query) => {
  const url = "https://www.googleapis.com/customsearch/v1";

  const response = await axios.get(url, {
    params: {
      key: GOOGLE_API_KEY,
      cx: GOOGLE_CX,
      q: query,
      num: 5,
    },
  });

  const items = response.data.items || [];

  // First: try strict blog/article URLs
  let results = items.filter(item => {
    const link = item.link.toLowerCase();
    return (
      link.includes("/blog") ||
      link.includes("/article") ||
      link.includes("/insights") ||
      link.includes("/guide")
    );
  });

  // Fallback: if fewer than 2, take next organic results
  if (results.length < 2) {
    const blockedDomains = [
  "amazon.",
  "youtube.",
  "quora.",
  "reddit.",
  "facebook.",
  "linkedin."
];

const fallback = items.filter(item => {
  const link = item.link.toLowerCase();
  return (
    !results.includes(item) &&
    !blockedDomains.some(domain => link.includes(domain))
  );
});

    results = results.concat(fallback);
  }

  // Return only 2
  return results.slice(0, 2).map(item => ({
    title: item.title,
    link: item.link,
  }));
};


module.exports = searchGoogle;

// Test run
if (require.main === module) {
  searchGoogle("Chatbots Magic Beginner’s Guidebook")
    .then(console.log)
    .catch(console.error);
}
