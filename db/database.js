const mongoose = require("mongoose");
const databaseUrl =
  process.env.DB_URL || "mongodb://127.0.0.1:27017/learn-smart";

mongoose.connect(databaseUrl, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});
