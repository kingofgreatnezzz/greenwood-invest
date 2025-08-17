import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, secretKey, name, password } = await request.json();
    
    // Simple security - you need to know this secret key
    if (secretKey !== 'investlp-admin-2024') {
      return NextResponse.json({ error: 'Invalid secret key' }, { status: 403 });
    }

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectDB();
    
    // First, try to drop any problematic indexes on the phone field
    try {
      const db = mongoose.connection.db;
      if (!db) {
        throw new Error('Database connection failed');
      }
      const collection = db.collection('users');
      
      // Get all indexes
      const indexes = await collection.indexes();
      
      // Find and drop any unique index on phone field
      for (const index of indexes) {
        if (index.key && index.key.phone === 1 && index.unique && index.name) {
          console.log('Dropping problematic phone index:', index.name);
          await collection.dropIndex(index.name);
        }
      }
    } catch (indexError) {
      console.log('Index cleanup warning:', indexError);
      // Continue even if index cleanup fails
    }
    
    // Try to find existing user first
    let user = await User.findOne({ email });
    
    if (user) {
      // User exists, update to admin
      user.role = 'admin';
      
      // If password is provided, hash and update it
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
      }
      
      await user.save();
    } else {
      // User doesn't exist, create new admin user
      if (!name || !password) {
        return NextResponse.json({ 
          error: 'User not found. Please provide name and password to create new admin user.' 
        }, { status: 400 });
      }
      
      // Hash password before saving
      const hashedPassword = await bcrypt.hash(password, 12);
      
      user = new User({
        name,
        email,
        password: hashedPassword,
        role: 'admin'
      });
      
      await user.save();
    }

    return NextResponse.json({ 
      message: 'Admin user created/updated successfully!',
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error setting up admin:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
