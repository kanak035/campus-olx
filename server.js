const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

require("dotenv").config();
var passport = require("passport");
var authenticate = require("./authenticate");

const productRouter = require("./routes/api/productRouter");
const userRouter = require("./routes/api/userRouter");
const bidRouter = require("./routes/api/bidRouter");
var favoriteRouter = require("./routes/api/favoriteRouter");

const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  next();
});

app.use(bodyParser.json());

const mongoURI = process.env.mongoURI;

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use(passport.initialize());

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/bids", bidRouter);
app.use("/api/favorites", favoriteRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started running on port ${port}`));
