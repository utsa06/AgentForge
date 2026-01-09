import mongoose from 'mongoose';

export const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-agent-builder');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn('⚠️ MongoDB connection failed. Server continuing in non-persistent mode.');
    // process.exit(1); // Allow server to start even if DB fails
  }
};