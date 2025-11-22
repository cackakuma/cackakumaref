const mongoose = require("mongoose");

let connector = process.env.MONGO_URI; // keep your variable name

const connectDB = async () => {
  try {
    if (!connector) {
      throw new Error("MONGO_URI is missing. Check your .env file.");
    }

    await mongoose.connect(connector);

    console.log("Connected to MongoDB at cacDB");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
