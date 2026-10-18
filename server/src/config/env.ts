import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bhojansetu',
  JWT_SECRET: process.env.JWT_SECRET || 'bhojansetu_secure_hackathon_demo_jwt_secret_key_32chars!',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  DEMO_MODE: process.env.DEMO_MODE === 'true' || true,
};

export function validateEnv() {
  if (!ENV.JWT_SECRET || ENV.JWT_SECRET.length < 16) {
    console.warn('⚠️ WARNING: JWT_SECRET is too short. Please set a strong JWT_SECRET in .env');
  }
  if (!ENV.MONGODB_URI) {
    throw new Error('MONGODB_URI must be defined in .env');
  }
}
