const mongoose = require("mongoose");

const colors = require("colors");
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://vamsikurumella46:vamsi@cluster0.mfnr6oq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log(
      `Connected to Mongodb Database ${mongoose.connection.host}`.bgMagenta
        .white
    );
  } catch (error) {
    console.log(`MONGO Connect Error ${error}`.bgRed.white);
  }
};

module.exports = connectDB;
