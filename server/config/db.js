const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in server/.env file!");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    if (error.message.includes("SSL") || error.message.includes("whitelist") || error.message.includes("ETIMEOUT")) {
      console.error(
        "💡 Tip: MongoDB Atlas Network Access check karein. Agar dynamic IP hai toh 'Allow Access From Anywhere (0.0.0.0/0)' add karein."
      );
    }
    throw error;
  }
};

module.exports = connectDB;
