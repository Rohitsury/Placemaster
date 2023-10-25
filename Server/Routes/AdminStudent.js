const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const cache = require('memory-cache'); // Import the memory-cache library

router.get('/studentData', async (req, res) => {
  try {
    const cachedData = cache.get('studentData');

    if (cachedData) {
      // Data is present in the cache, send cached data
      res.json({ cached: true, data: cachedData }).status(200);
    } else {
      // Data is not in the cache, fetch from the database
      let collection = await mongoose.connection.db.collection("student_registers");
      let results = await collection.find({}).toArray();

      // Cache the fetched data for future use (expire after a certain time)
      cache.put('studentData', results, 60000); // Cache for one minute

      res.json({ cached: false, data: results }).status(200);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});


module.exports = router;
