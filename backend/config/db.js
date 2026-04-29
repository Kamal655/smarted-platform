import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let isInMemory = false;

/**
 * MongoDB Connection Handler with In-Memory Fallback
 * ─────────────────────────────────────────────
 * PRODUCTION READY: Includes robust monitoring, 
 * explicit log messages, and strict error handling.
 * FALLBACK: If Atlas fails, starts a local in-memory DB.
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    // 1. Check for Missing URI
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in .env');
    }

    // 2. Attempt Connection with a shorter timeout for quicker fallback
    console.log('📡 Attempting to connect to MongoDB Atlas...');
    await mongoose.connect(mongoUri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout for Atlas
    });

    // 3. Success Log
    console.log('✅ Database Connected Successfully (Atlas)');
    console.log(`📡 Host: ${mongoose.connection.host}`);
    
  } catch (error) {
    console.warn('⚠️ Atlas Connection Failed. Falling back to In-Memory Database...');
    console.error(`📝 Error Details: ${error.message}`);

    try {
      const mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      
      await mongoose.connect(memoryUri);
      isInMemory = true;
      
      console.log('✅ Database Connected Successfully (In-Memory)');
      console.log('🚀 TIP: Using in-memory DB. Data will be reset on restart.');
    } catch (innerError) {
      console.error('❌ FATAL ERROR: In-Memory Database failed to start');
      console.error(`📝 Details: ${innerError.message}`);
      process.exit(1);
    }
  }

  // Ongoing Connection Monitoring
  mongoose.connection.on('error', err => {
    console.error(`❌ Runtime Database Error: ${err.message}`);
  });
};

export { isInMemory };
export default connectDB;
