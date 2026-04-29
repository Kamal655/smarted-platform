import express from 'express';
import mongoose from 'mongoose';
import { seedData } from '../seeder.js';

const router = express.Router();

/**
 * @desc    Force Manual Seed (Database Refresh)
 * @route   GET /api/seed
 * @access  Public
 */
router.get('/seed', async (req, res) => {
  try {
    await seedData(false);
    res.json({ message: "Database refreshed with all 9 professional internships!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @desc    Database Connectivity & Persistence Test
 * @route   GET /api/test-db
 * @access  Public (For verification purposes)
 */
router.get('/test-db', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = { 0: 'Disconnected', 1: 'Connected', 2: 'Connecting', 3: 'Disconnecting' };

    // 1. Verify Connection State
    if (dbState !== 1) {
      return res.status(500).json({
        status: "Database Not Connected",
        state: states[dbState]
      });
    }

    // 2. Data Persistence Test
    // Create a temporary collection and insert a record
    const TestModel = mongoose.model('ConnectionTest', new mongoose.Schema({
      testData: String,
      timestamp: { type: Date, default: Date.now }
    }), 'connection_tests');

    const newRecord = await TestModel.create({ testData: "Final Project Verification Sync" });
    
    // Fetch it back
    const fetchedRecord = await TestModel.findById(newRecord._id);

    // Cleanup (delete the test record)
    await TestModel.findByIdAndDelete(newRecord._id);

    // 3. Status Report
    res.json({
      message: "Database Connected Successfully",
      verification: {
        host: mongoose.connection.host,
        dbName: mongoose.connection.name,
        persistenceTest: fetchedRecord ? "Passed: Data inserted and retrieved" : "Failed",
        isPersistent: !mongoose.connection.host.includes('127.0.0.1') && !mongoose.connection.host.includes('localhost'),
        atlasVerified: mongoose.connection.host.includes('mongodb.net')
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      message: "Database Connection Verification Failed",
      error: error.message
    });
  }
});

export default router;
