import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/dermascan';
    console.log(`[DB] Attempting connection to: ${connStr}`);
    
    // Set a short timeout for local development so it falls back quickly if MongoDB isn't running
    const options = {
      serverSelectionTimeoutMS: 3000, 
    };

    const conn = await mongoose.connect(connStr, options);
    console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);
    global.isMockDB = false;
  } catch (error) {
    console.warn(`\n[WARNING] MongoDB connection failed: ${error.message}`);
    console.warn(`[WARNING] DermaScan AI is starting in "Demo Offline Mode" (In-Memory Database).`);
    console.warn(`[WARNING] Data will persist in-memory during server runtime and authentication will use simulated validation.\n`);
    global.isMockDB = true;
  }
};

export default connectDB;
