import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Transaction from '@/models/Transaction';
import { connectDB } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get user ID from session or query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || session.user.id;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Fetch transactions for the user
    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 transactions

    return NextResponse.json({ 
      success: true, 
      transactions,
      count: transactions.length 
    });

  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' }, 
      { status: 500 }
    );
  }
}
