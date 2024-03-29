const express = require("express");
require("./db/database");
const path = require("path");
const methodOverride = require("method-override");
const adminRouter = require("./Routers/adminRouter");
const userRouter = require("./Routers/userRouter");
const contactRouter = require("./Routers/contactRouter");
const session = require("express-session");
const flash = require("connect-flash");
const mongoSanitize = require("express-mongo-sanitize");
const mongoStore = require("connect-mongo");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const store = mongoStore.create({
  mongoUrl: process.env.DB_URL,
  secret: process.env.SECRET_KEY,
  touchAfter: 14 * 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("Session Store Error", e);
  s;
});

const secretKey = {
  store,
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(secretKey));
app.use(flash());

app.use((req, res, next) => {
  res.locals.currentLoggedIn = req.session.customer_id;
  res.locals.success = req.flash("success");
  next();
});

// Admin Router
app.use(adminRouter);
app.use(userRouter);
app.use(contactRouter);

app.get("*", (req, res) => {
  res.status(404).send({ error: "Page Not Found" });
});

// // Listening to port
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
