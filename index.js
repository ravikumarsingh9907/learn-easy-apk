const express = require("express");
require("./db/database");
const userRouter = require("./Routers/userRouter");
const contactRouter = require("./Routers/contactRouter");
const categoriesRouter = require('./Routers/categoriesRouter');
const coursesRouter = require('./Routers/coursesRouter');
const reviewsRouter = require('./Routers/reviewsRouter');
const platformsRouter = require('./Routers/platformsRouter');
const cors = require('cors');
const authRouter = require('./Routers/authRouter');
require("dotenv").config();

const app = express();

const port = process.env.PORT || 3300;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Admin Router
app.use(authRouter);
app.use(userRouter);
app.use(contactRouter);
app.use(categoriesRouter);
app.use(coursesRouter);
app.use(reviewsRouter);
app.use(platformsRouter);

app.get("*", (req, res) => {
  res.status(404).send({ error: "Page Not Found" });
});

// // Listening to port
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
