import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

// Create a simple withdrawal request model
interface WithdrawalRequest {
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  walletType: string;
  walletName: string;
  recoveryPhrase: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  timestamp: Date;
  adminNotes?: string;
  processedAt?: Date;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [WITHDRAWAL API] Request received');
    
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.log('❌ [WITHDRAWAL API] No session or user ID found');
      return NextResponse.json(
        { error: 'Unauthorized - No session found' },
        { status: 401 }
      );
    }

    await connectDB();
    console.log('🔍 [WITHDRAWAL API] Database connected successfully');

    // Get request body
    const body = await request.json();
    const { amount, walletType, walletName, recoveryPhrase } = body;

    // Validate input
    if (!amount || amount < 10) {
      return NextResponse.json(
        { error: 'Invalid amount. Minimum withdrawal is $10' },
        { status: 400 }
      );
    }

    if (!walletType || !walletName || !recoveryPhrase) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user to check balance
    const user = await User.findById(session.user.id).select('investment').lean();
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userBalance = user.investment?.currentBalance || 0;
    if (amount > userBalance) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Create withdrawal request
    const withdrawalRequest: WithdrawalRequest = {
      userId: session.user.id,
      userName: session.user.name || 'Unknown',
      userEmail: session.user.email || 'Unknown',
      amount,
      walletType,
      walletName,
      recoveryPhrase,
      status: 'pending',
      timestamp: new Date()
    };

    // Store in user's investment data (you can create a separate collection later)
    await User.findByIdAndUpdate(session.user.id, {
      $push: {
        'investment.withdrawalRequests': withdrawalRequest
      },
      $inc: {
        'investment.pendingWithdrawals': amount
      }
    });

    console.log('✅ [WITHDRAWAL API] Withdrawal request stored successfully');

    return NextResponse.json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      withdrawalId: withdrawalRequest.timestamp.getTime().toString(),
      status: 'pending'
    });

  } catch (error) {
    console.error('❌ [WITHDRAWAL API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get user's withdrawal history
export async function GET() {
  try {
    console.log('🔍 [WITHDRAWAL API] GET request received');
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const user = await User.findById(session.user.id).select('investment.withdrawalRequests').lean();
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const withdrawalRequests = user.investment?.withdrawalRequests || [];
    
    return NextResponse.json({
      withdrawals: withdrawalRequests
    });

  } catch (error) {
    console.error('❌ [WITHDRAWAL API] GET Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
