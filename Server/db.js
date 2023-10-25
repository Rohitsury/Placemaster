const mongoose = require("mongoose");
// const dotenv = require('dotenv');
// dotenv.config();

const DBURL = process.env.DATABASE


const ConnMongo = async () => {
  try {
    await mongoose.connect(DBURL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Successfully Connected to Database");
  } catch (err) {
    console.error("Error connecting to Database:", err);
  }
};

module.exports = ConnMongo;
