# BeyondChats Assignment – Blog Scraper API

This project scrapes the oldest blog articles from the BeyondChats website and stores them in a MongoDB database.  
It also exposes CRUD APIs to manage the scraped articles.

---

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- Axios
- Cheerio

---

## Features

- Scrapes the 5 oldest blog articles from BeyondChats
- Extracts title, content, and URL
- Stores articles in MongoDB
- CRUD APIs for articles

---

## Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/solehasiddique/beyondchats-assignment
cd beyondchats-assignment
npm install
```

## Environment Variables

Create a `.env` file in the root directory with the following:

MONGO_URI=your_mongodb_connection_string
PORT=3000

