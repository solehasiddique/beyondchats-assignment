require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db.js");

const PORT = 3000;

const startServer = async () => {
  await connectDB();          // 🔥 WAIT for MongoDB
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
