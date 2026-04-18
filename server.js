const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const colors = require("colors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");           // ← ADD THIS
const connectDB = require("./config/db");

// ✅ Load env variables FIRST
dotenv.config();

const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health check
app.get("/api/v1/health", (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  return res.status(isDbConnected ? 200 : 503).send({
    success: isDbConnected,
    dbConnected: isDbConnected,
    message: isDbConnected
      ? "Server and database are connected"
      : !process.env.MONGO_URL
      ? "Database is not configured. Add MONGO_URL to .env"
      : "Database is not connected. Check MongoDB URL or whitelist",
  });
});

// Block API if DB not connected
app.use("/api/v1", (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).send({
      success: false,
      message: !process.env.MONGO_URL
        ? "Database is not configured"
        : "Database is not connected",
    });
  }
  next();
});

// API routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);

// ✅ Serve React in production  ← ADD THIS BLOCK
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build/index.html"));
  });
}

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}`.bgCyan.white);
    });
  } catch (error) {
    console.log(`Server startup error: ${error.message}`.bgRed.white);
  }
};

startServer();