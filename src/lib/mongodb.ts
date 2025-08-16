import mongoose from 'mongoose';

// Enhanced debugging for environment variables
console.log('🔍 Environment Debug Info:');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('MONGODB_URI length:', process.env.MONGODB_URI?.length || 0);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Current working directory:', process.cwd());

// Check if .env.local is being loaded
const fs = require('fs');
const path = require('path');
const envLocalPath = path.join(process.cwd(), '.env.local');
console.log('🔍 .env.local file exists:', fs.existsSync(envLocalPath));
console.log('🔍 .env.local file path:', envLocalPath);

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined!');
  console.error('❌ Available environment variables:', Object.keys(process.env).filter(key => key.includes('MONGO')));
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

console.log('✅ MONGODB_URI found:', process.env.MONGODB_URI.substring(0, 20) + '...');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    console.log('✅ Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('🔄 Connection string:', process.env.MONGODB_URI);
    
    cached.promise = mongoose.connect(process.env.MONGODB_URI!, opts);
  }

  try {
    cached.conn = await cached.promise;
    console.log('✅ MongoDB connected successfully!');
    console.log('✅ Database name:', cached.conn.connection.db.databaseName);
    console.log('✅ Connection state:', cached.conn.connection.readyState);
    return cached.conn;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    cached.promise = null;
    throw error;
  }
}
