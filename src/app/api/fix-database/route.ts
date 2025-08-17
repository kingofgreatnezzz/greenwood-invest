import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    const { secretKey } = await request.json();
    
    // Simple security
    if (secretKey !== 'investlp-admin-2024') {
      return NextResponse.json({ error: 'Invalid secret key' }, { status: 403 });
    }

    await connectDB();
    
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection failed');
    }
    const collection = db.collection('users');
    
    console.log('🔍 Checking for problematic indexes...');
    
    try {
      // Get all indexes
      const indexes = await collection.indexes();
      console.log('📋 Current indexes:', indexes);
      
      // Find and drop any unique index on phone field
      for (const index of indexes) {
        if (index.key && index.key.phone === 1 && index.name) {
          console.log('🚨 Found problematic phone index:', index.name);
          console.log('🗑️ Dropping index:', index.name);
          await collection.dropIndex(index.name);
          console.log('✅ Index dropped successfully');
        }
      }
      
      // Also try to drop by name if we know it
      try {
        await collection.dropIndex('phone_1');
        console.log('✅ Dropped phone_1 index by name');
      } catch {
        console.log('ℹ️ phone_1 index not found or already dropped');
      }
      
      // Verify indexes after cleanup
      const indexesAfter = await collection.indexes();
      console.log('📋 Indexes after cleanup:', indexesAfter);
      
      return NextResponse.json({ 
        message: 'Database indexes cleaned up successfully!',
        indexesBefore: indexes.length,
        indexesAfter: indexesAfter.length
      });
      
    } catch (indexError) {
      console.error('❌ Index cleanup error:', indexError);
      const errorMessage = indexError instanceof Error ? indexError.message : 'Unknown error';
      return NextResponse.json({ 
        error: 'Index cleanup failed',
        details: errorMessage 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Database fix error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
