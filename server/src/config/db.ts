import mongoose from 'mongoose';
import { ENV } from './env.js';

export async function connectDB(): Promise<typeof mongoose> {
  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    console.error('💡 Ensure local MongoDB is running, or set MONGODB_URI in server/.env to your MongoDB Atlas cluster.');
    throw error;
  }
}
