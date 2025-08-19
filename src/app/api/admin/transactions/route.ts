import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Transaction from '@/models/Transaction';
import User from '@/models/User';
import { connectDB } from '@/lib/mongodb';

// GET - Fetch all transactions or transactions for a specific user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    let query = {};
    if (userId) {
      query = { userId };
    }

    const transactions = await Transaction.find(query)
      .populate('userId', 'name email')
      .populate('processedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments(query);

    return NextResponse.json({ 
      success: true, 
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' }, 
      { status: 500 }
    );
  }
}

// POST - Create a new transaction
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { userId, type, amount, description, reference, adminNotes, metadata } = body;

    // Validate required fields
    if (!userId || !type || !amount || !description) {
      return NextResponse.json({ 
        error: 'Missing required fields: userId, type, amount, description' 
      }, { status: 400 });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create transaction
    const transaction = new Transaction({
      userId,
      type,
      amount,
      description,
      reference,
      adminNotes,
      metadata,
      processedBy: session.user.id,
      processedAt: new Date(),
      status: 'completed' // Admin-created transactions are typically completed
    });

    await transaction.save();

    // Update user's investment data based on transaction type
    if (type === 'deposit') {
      await User.findByIdAndUpdate(userId, {
        $inc: { 'investment.totalDeposits': amount, 'investment.currentBalance': amount }
      });
    } else if (type === 'withdrawal') {
      await User.findByIdAndUpdate(userId, {
        $inc: { 'investment.totalWithdrawals': amount, 'investment.currentBalance': -amount }
      });
    } else if (type === 'profit') {
      await User.findByIdAndUpdate(userId, {
        $inc: { 'investment.totalProfit': amount, 'investment.currentBalance': amount }
      });
    }

    return NextResponse.json({ 
      success: true, 
      transaction,
      message: 'Transaction created successfully' 
    });

  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' }, 
      { status: 500 }
    );
  }
}

// PUT - Update an existing transaction
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { transactionId, updates } = body;

    if (!transactionId || !updates) {
      return NextResponse.json({ 
        error: 'Missing required fields: transactionId, updates' 
      }, { status: 400 });
    }

    // Find and update transaction
    const transaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { 
        ...updates, 
        updatedAt: new Date(),
        processedBy: session.user.id,
        processedAt: new Date()
      },
      { new: true }
    );

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      transaction,
      message: 'Transaction updated successfully' 
    });

  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction' }, 
      { status: 500 }
    );
  }
}

// DELETE - Delete a transaction
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('id');

    if (!transactionId) {
      return NextResponse.json({ error: 'Transaction ID required' }, { status: 400 });
    }

    const transaction = await Transaction.findByIdAndDelete(transactionId);

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Transaction deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { error: 'Failed to delete transaction' }, 
      { status: 500 }
    );
  }
}
