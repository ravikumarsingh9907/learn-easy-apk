const mongoose = require("mongoose");
require("dotenv").config();

const databaseUrl =
  process.env.DB_URL || "mongodb://localhost:27017/learn-easy";

mongoose.connect(databaseUrl, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});
