const mongoose = require("mongoose");
const colors = require("colors");

// optional configs
mongoose.set("strictQuery", true);
mongoose.set("bufferCommands", false);

const connectDB = async () => {
  const mongoUrl = process.env.MONGO_URL;

  // 🔍 DEBUG LINE (VERY IMPORTANT)
  console.log("MONGO_URL:", mongoUrl);

  if (!mongoUrl) {
    console.log(
      "MONGO_URL is missing in .env file".bgRed.white
    );
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(
      `MongoDB Connected: ${conn.connection.host}`.bgMagenta.white
    );
  } catch (error) {
    console.log(`MONGO Connect Error: ${error.message}`.bgRed.white);
  }
};

module.exports = connectDB;