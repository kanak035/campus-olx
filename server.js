// Load environment variables
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const passport = require("passport");

const cors = require("./routes/cors");
const authenticate = require("./authenticate");

// Routers
const productRouter = require("./routes/api/productRouter");
const userRouter = require("./routes/api/userRouter");
const bidRouter = require("./routes/api/bidRouter");
const favoriteRouter = require("./routes/api/favoriteRouter");

const app = express();

// Middleware: CORS headers
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Parse JSON body
app.use(bodyParser.json());

// ✅ Correctly load Mongo URI from .env
const mongoURI = process.env.MONGO_URI;

// Debugging help (optional)
console.log("Mongo URI:", mongoURI);

// ✅ Connect to MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// Initialize Passport
app.use(passport.initialize());

// Routes
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/bids", bidRouter);
app.use("/api/favorites", favoriteRouter);

// Static file serving for production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Port from .env or default
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`🚀 Server started on port ${port}`));
