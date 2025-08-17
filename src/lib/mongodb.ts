import mongoose from 'mongoose';

// Type declaration for global mongoose cache
declare global {
  var mongoose: {
    conn: import('mongoose').Mongoose | null;
    promise: Promise<import('mongoose').Mongoose> | null;
  } | undefined;
}

// Enhanced debugging for environment variables
console.log('🔍 Environment Debug Info:');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('MONGODB_URI length:', process.env.MONGODB_URI?.length || 0);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Current working directory:', process.cwd());

// Check if .env.local is being loaded
import fs from 'fs';
import path from 'path';
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

// Ensure cached is always defined
if (!cached) {
  throw new Error('Failed to initialize mongoose cache');
}

export async function connectDB() {
  // At this point, cached is guaranteed to be defined
  const mongooseCache = cached!;
  
  if (mongooseCache.conn) {
    console.log('✅ Using cached MongoDB connection');
    return mongooseCache.conn;
  }

  if (!mongooseCache.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('🔄 Connection string:', process.env.MONGODB_URI);
    
    mongooseCache.promise = mongoose.connect(process.env.MONGODB_URI!, opts);
  }

  try {
    mongooseCache.conn = await mongooseCache.promise;
    console.log('✅ MongoDB connected successfully!');
    
    // Safely access database properties with null checks
    if (mongooseCache.conn?.connection?.db) {
      console.log('✅ Database name:', mongooseCache.conn.connection.db.databaseName);
    }
    
    if (mongooseCache.conn?.connection) {
      console.log('✅ Connection state:', mongooseCache.conn.connection.readyState);
    }
    
    return mongooseCache.conn;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    mongooseCache.promise = null;
    throw error;
  }
}
