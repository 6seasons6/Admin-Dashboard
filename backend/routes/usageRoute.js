const express = require('express');
const router = express.Router();
const Usage = require('../models/Usage'); // Your usage tracking model
const User=require('../models/User');

router.post('/trackUsage', async (req, res) => {
  try {
    const { userId, duration } = req.body;

    let usageData = await Usage.findOne({ userId });

    const now = new Date();
    const currentDate = now.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    if (!usageData) {
      usageData = new Usage({
        userId,
        daily: duration,
        monthly: duration,
        yearly: duration,
        lastUpdated: currentDate,
      });
    } else {
      if (usageData.lastUpdated !== currentDate) {
        usageData.daily = duration;
      } else {
        usageData.daily += duration;
      }

      usageData.monthly += duration;
      usageData.yearly += duration;
      usageData.lastUpdated = currentDate;
    }

    await usageData.save();
    res.json({ message: "Usage updated successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error updating usage", error });
  }
});

router.get('/api/usage', async (req, res) => { 
  const { userId } = req.query;

  // Check if userId is provided before querying the database
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch the usage data for the user
    const usageData = await Usage.findOne({ userId });
    if (!usageData) {
      return res.status(404).json({ message: "Usage data not found" });
    }

    // Return the usage data
    res.json(usageData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching usage data", error });
  }
});

module.exports = router;
